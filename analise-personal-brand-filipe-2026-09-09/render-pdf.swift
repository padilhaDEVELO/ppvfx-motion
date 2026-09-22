import Foundation
import PDFKit
import AppKit

let args = CommandLine.arguments
guard args.count == 3, let document = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    fatalError("Uso: render-pdf.swift entrada.pdf pasta-saida")
}
let output = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
for i in 0..<document.pageCount {
    guard let page = document.page(at: i) else { continue }
    let bounds = page.bounds(for: .mediaBox)
    let size = NSSize(width: 1100, height: 1100 * bounds.height / bounds.width)
    let img = page.thumbnail(of: size, for: .mediaBox)
    guard let tiff = img.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff),
          let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("Falha ao renderizar página") }
    try png.write(to: output.appendingPathComponent(String(format: "pagina-%02d.png", i+1)))
}
print("Páginas renderizadas: \(document.pageCount)")
