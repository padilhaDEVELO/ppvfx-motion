import Foundation
import AppKit
import CoreText

let root = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let width = 1080, height = 1920
let fontRoot = URL(fileURLWithPath: "/Users/ppvfx/Library/Fonts", isDirectory: true)
func font(_ file: String, size: CGFloat) -> CTFont {
    let url = fontRoot.appendingPathComponent(file)
    CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
    let descriptor = (CTFontManagerCreateFontDescriptorsFromURL(url as CFURL) as? [CTFontDescriptor])!.first!
    return CTFontCreateWithFontDescriptor(descriptor, size, nil)
}
let rgb = CGColorSpaceCreateDeviceRGB()
let ctx = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8,
                    bytesPerRow: 0, space: rgb, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
let source = NSImage(contentsOf: root.appendingPathComponent("frames/frame-escolhido.png"))!
var bounds = CGRect(x: 0, y: 0, width: width, height: height)
let sourceCG = source.cgImage(forProposedRect: &bounds, context: nil, hints: nil)!
ctx.draw(sourceCG, in: bounds)
ctx.setFillColor(CGColor(red: 0.012, green: 0.008, blue: 0.004, alpha: 0.12))
ctx.fill(bounds)
let shades: [CGFloat] = [0.97,0.94,0.83,0.16,0.02,0.20]
let stops: [CGFloat] = [0,0.26,0.47,0.60,0.74,1]
let colors = shades.map { CGColor(red: 0.012, green: 0.008, blue: 0.004, alpha: $0) }
let gradient = CGGradient(colorsSpace: rgb, colors: colors as CFArray, locations: stops)!
ctx.drawLinearGradient(gradient, start: CGPoint(x: 0,y:0), end: CGPoint(x:0,y:height), options: [])

func text(_ content: String, baselineFromTop: CGFloat, size: CGFloat, maxWidth: CGFloat, color: CGColor, familyFile: String = "TuskerGrotesk-5500Medium.otf") {
    var actualSize = size
    var line: CTLine!
    var lineWidth: CGFloat = 0
    repeat {
        let attributes: [NSAttributedString.Key: Any] = [
            NSAttributedString.Key(kCTFontAttributeName as String): font(familyFile,size:actualSize),
            NSAttributedString.Key(kCTForegroundColorAttributeName as String): color]
        line = CTLineCreateWithAttributedString(NSAttributedString(string: content, attributes: attributes))
        lineWidth = CGFloat(CTLineGetTypographicBounds(line,nil,nil,nil))
        if lineWidth > maxWidth { actualSize -= 1 }
    } while lineWidth > maxWidth && actualSize > 20
    ctx.saveGState()
    ctx.setShadow(offset:CGSize(width:0,height:-3), blur:12, color:CGColor(gray:0,alpha:0.55))
    ctx.textPosition=CGPoint(x:(CGFloat(width)-lineWidth)/2,y:CGFloat(height)-baselineFromTop)
    CTLineDraw(line,ctx)
    ctx.restoreGState()
    print("\(content): fonte \(actualSize), largura \(Int(lineWidth))")
}
text("GESTÃO HUMANIZADA",baselineFromTop:1110,size:88,maxWidth:900,color:CGColor(gray:1,alpha:1),familyFile:"SFPRODISPLAYBOLD.otf")
text("NÃO É BAGUNÇA",baselineFromTop:1310,size:188,maxWidth:940,color:CGColor(red:1,green:122/255,blue:0,alpha:1))
text("@filipefrazao1",baselineFromTop:1440,size:28,maxWidth:800,color:CGColor(red:157/255,green:157/255,blue:159/255,alpha:1),familyFile:"Montserrat-Regular.ttf")

let result = ctx.makeImage()!
let bitmap = NSBitmapImageRep(cgImage:result)
try bitmap.representation(using:.png,properties:[:])!.write(to:root.appendingPathComponent("CAPA_CULTURA_TIKTOK_1080x1920.png"))
try bitmap.representation(using:.jpeg,properties:[.compressionFactor:0.95])!.write(to:root.appendingPathComponent("CAPA_CULTURA_TIKTOK_1080x1920.jpg"))
let crop = result.cropping(to:CGRect(x:0,y:240,width:1080,height:1440))!
try NSBitmapImageRep(cgImage:crop).representation(using:.jpeg,properties:[.compressionFactor:0.9])!.write(to:root.appendingPathComponent("PREVIA_RECORTE_3x4.jpg"))
print("Capa local exportada em PNG e JPG: 1080 × 1920")
