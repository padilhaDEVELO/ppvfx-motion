#!/usr/bin/env python3
"""Projeto e entregas locais de marca pessoal. Python 3.10+, biblioteca padrão."""
import argparse
import base64
import csv
import hashlib
import html
import json
import re
import shutil
import tempfile
import zipfile
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
ICONS = {
    'compass': '<circle cx="50" cy="50" r="31"/><path d="M65 34 57 57 34 65 43 43Z"/>',
    'steps': '<path d="M20 80V60h20V40h20V20h20"/>',
    'chart': '<path d="M20 80h65M30 68V50m22 18V35m22 33V20"/>',
    'people': '<circle cx="50" cy="30" r="13"/><path d="M24 80V68a26 26 0 0 1 52 0v12"/>',
    'mic': '<rect x="39" y="16" width="22" height="43" rx="11"/><path d="M28 46v5a22 22 0 0 0 44 0v-5M50 73v13M35 86h30"/>',
    'globe': '<circle cx="50" cy="50" r="32"/><ellipse cx="50" cy="50" rx="14" ry="32"/><path d="M18 50h64M25 33h50M25 67h50"/>',
    'calendar': '<rect x="22" y="25" width="56" height="56" rx="4"/><path d="M22 42h56M36 17v18M64 17v18M35 55h10m10 0h10M35 68h10"/>',
    'arrow': '<path d="M20 50h60M55 25l25 25-25 25"/>',
}

def dump(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'

def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()

def slug(value):
    if not isinstance(value, str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,63}', value):
        raise ValueError('Identificador deve conter letras minúsculas, números e hífens: ' + repr(value))
    return value

def inside(root, rel):
    p = (root / rel).resolve()
    if not p.is_relative_to(root.resolve()):
        raise ValueError('Caminho fora do projeto: ' + str(rel))
    return p

def txt(value):
    if not isinstance(value, str):
        raise ValueError('Texto deve ser uma string.')
    return html.escape(value, quote=True)

def br(value):
    return txt(value).replace('\n', '<br>')

def init(project, name):
    if project.exists():
        raise ValueError('Destino já existe. Use a pasta existente sem reinicializar ou escolha outra.')
    project.mkdir(parents=True)
    for name_dir in ['fontes', 'planejamento', 'conteudo', 'assets', 'entregas']:
        (project / name_dir).mkdir()
    data = {'schema_version': 1, 'person': name, 'title': 'Projeto de marca pessoal',
            'status': 'rascunho', 'bio': '',
            'visual': {'background': '#101113', 'foreground': '#FFFFFF', 'accent': '#D0B779'},
            'deck': [], 'highlights': [], 'posts': []}
    (project / 'projeto.json').write_text(dump(data), encoding='utf8')
    (project / 'estado.json').write_text(dump({'versao_vigente': None, 'etapas': {}, 'limitacoes': []}), encoding='utf8')
    shutil.copyfile(SKILL / 'references/modelo-dossie.md', project / 'dossie.md')
    (project / 'decisoes.md').write_text('# Registro de decisões\n\nRegistrar data, decisão, evidência e arquivos impactados.\n', encoding='utf8')
    with (project / 'fontes/fontes.csv').open('w', newline='', encoding='utf8') as f:
        csv.writer(f).writerow(['id', 'origem', 'data_coleta', 'publicado_em', 'canal', 'profundidade',
                               'trecho', 'falante', 'observacao', 'interpretacao', 'uso', 'arquivo'])
    return {'project': str(project), 'status': 'estrutura_criada; preencher pesquisa e conteúdo'}

def color(value):
    if not isinstance(value, str) or not re.fullmatch(r'#[0-9a-fA-F]{6}', value):
        raise ValueError('Cor deve estar em #RRGGBB.')
    return value

def embedded(project, rel, kinds):
    file = inside(project, rel)
    mime = kinds.get(file.suffix.lower())
    if not mime or not file.is_file():
        raise ValueError('Recurso local ausente ou formato não suportado: ' + str(rel))
    return 'data:' + mime + ';base64,' + base64.b64encode(file.read_bytes()).decode()

def build(project, version):
    slug(version)
    data_path = project / 'projeto.json'
    d = json.loads(data_path.read_text(encoding='utf8'))
    if d.get('schema_version') != 1 or not d.get('person') or not d.get('title'):
        raise ValueError('schema_version=1, person e title são obrigatórios.')
    slides = d.get('deck')
    if not isinstance(slides, list) or not slides:
        raise ValueError('Preencha deck com slides completos antes de construir.')
    dest = project / 'entregas' / version
    if dest.exists():
        raise ValueError('Versão já existe; preserve-a e escolha outro identificador.')
    dest.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix='.' + version + '-build-', dir=dest.parent))
    assets = []
    try:
        visual = d.get('visual', {})
        bg = color(visual.get('background', '#101113'))
        fg = color(visual.get('foreground', '#FFFFFF'))
        ac = color(visual.get('accent', '#D0B779'))
        css = (SKILL / 'assets/apresentacao.css').read_text(encoding='utf8')
        face = ''
        if visual.get('font_file'):
            uri = embedded(project, visual['font_file'], {'.ttf': 'font/ttf', '.woff2': 'font/woff2', '.otf': 'font/otf'})
            face = '@font-face{font-family:BrandLocal;src:url(' + uri + ')}'
        css = face + ':root{--bg:' + bg + ';--fg:' + fg + ';--accent:' + ac + ';}' + css
        sections = []
        for i, s in enumerate(slides):
            kind = s.get('layout', 'text')
            if kind not in ['cover', 'text', 'columns', 'image'] or not s.get('title'):
                raise ValueError('Slide precisa de title e layout válido.')
            body = '<p class="body">' + br(s.get('body', '')) + '</p>' if s.get('body') else ''
            if kind == 'columns':
                cols = s.get('columns', [])
                if not 1 <= len(cols) <= 3:
                    raise ValueError('Layout columns aceita 1 a 3 colunas.')
                body += '<div class="columns">' + ''.join('<article><h3>' + br(c['title']) + '</h3><p>' + br(c['body']) + '</p></article>' for c in cols) + '</div>'
            if kind == 'image':
                uri = embedded(project, s['image'], {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'})
                body = '<div class="image-layout"><img alt="' + txt(s.get('alt', 'Imagem do projeto')) + '" src="' + uri + '"><div>' + body + '</div></div>'
            refs = []
            for r in s.get('sources', []):
                if r.get('url'):
                    url = r['url']
                    if not re.match(r'^https?://[^\s]+$', url):
                        raise ValueError('URL de fonte precisa usar HTTP(S).')
                    refs.append('<a href="' + txt(url) + '">' + txt(r['label']) + '</a>')
                elif r.get('source_id'):
                    refs.append(txt(r['source_id']) + ' — ' + txt(r['label']))
                else: raise ValueError('Fonte precisa de url ou source_id do registro local.')
            sections.append('<section class="slide ' + kind + '"><div class="content"><p class="eyebrow">' + txt(s.get('eyebrow', d['title'])) + '</p><h1>' + br(s['title']) + '</h1>' + body + '</div><div class="notes">' + br(s.get('note', '')) + ('<br>' + ' · '.join(refs) if refs else '') + '</div><footer><span>' + txt(d['person']) + '</span><span>' + txt(d.get('status', 'proposta')) + ' · ' + str(i + 1) + '/' + str(len(slides)) + '</span></footer></section>')
        doc = '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + txt(d['title']) + '</title><style>' + css + '</style><body>' + '\n'.join(sections) + '</body></html>'
        (stage / 'apresentacao.html').write_text(doc, encoding='utf8')
        kit = stage / 'kit'; kit.mkdir()
        (kit / 'bio.txt').write_text(d.get('bio', '') + '\n', encoding='utf8')
        for channel, bio in d.get('bios', {}).items():
            slug(channel)
            (kit / ('bio-' + channel + '.txt')).write_text(bio + '\n', encoding='utf8')
        (kit / 'tokens.json').write_text(dump(visual), encoding='utf8')
        names = set()
        for h in d.get('highlights', []):
            ident = slug(h['id'])
            if ident in names: raise ValueError('Destaque duplicado: ' + ident)
            names.add(ident)
            icon = ICONS[h.get('icon', 'compass')]
            svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><title>' + txt(h['title']) + '</title><rect width="1080" height="1920" fill="' + bg + '"/><circle cx="540" cy="960" r="228" fill="none" stroke="' + ac + '"/><g transform="translate(350 770) scale(3.8)" fill="none" stroke="' + ac + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + icon + '</g></svg>'
            rel = 'kit/destaques/' + ident + '.svg'
            file = stage / rel; file.parent.mkdir(exist_ok=True)
            file.write_text(svg, encoding='utf8')
            assets.append({'file': rel, 'width': 1080, 'height': 1920, 'kind': 'highlight'})
        names = set()
        for post in d.get('posts', []):
            ident = slug(post['id'])
            if ident in names: raise ValueError('Post duplicado: ' + ident)
            names.add(ident)
            if not post.get('slides'): raise ValueError('Post precisa das telas completas: ' + ident)
            postdir = kit / 'posts' / ident; postdir.mkdir(parents=True)
            (postdir / 'legenda.txt').write_text(post.get('caption', '') + '\n', encoding='utf8')
            for channel, caption in post.get('captions', {}).items():
                slug(channel)
                (postdir / ('legenda-' + channel + '.txt')).write_text(caption + '\n', encoding='utf8')
            for i, s in enumerate(post['slides']):
                # Wrap deterministicamente; QA do navegador confere os limites efetivos.
                import textwrap
                title_lines = [line for para in s['title'].split('\n') for line in (textwrap.wrap(para, 23, break_long_words=False) or [''])]
                body_lines = [line for para in s.get('body', '').split('\n') for line in (textwrap.wrap(para, 42, break_long_words=False) or [''])]
                y_body = 285 + 90 * len(title_lines)
                if y_body + 49 * len(body_lines) > 1160:
                    raise ValueError('Conteúdo longo demais: ' + ident + ' tela ' + str(i + 1) + '. Divida a tela.')
                svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><style>' + face + 'text{font-family:BrandLocal,Arial,sans-serif}</style><rect width="1080" height="1350" fill="' + bg + '"/><text x="80" y="120" fill="' + ac + '" font-size="24">' + txt(d['person']) + '</text>'
                for j, line in enumerate(title_lines): svg += '<text x="80" y="' + str(260 + 90 * j) + '" fill="' + fg + '" font-size="72" font-weight="700">' + txt(line) + '</text>'
                for j, line in enumerate(body_lines): svg += '<text x="80" y="' + str(y_body + 49 * j) + '" fill="' + fg + '" font-size="34">' + txt(line) + '</text>'
                svg += '<path d="M80 1210h920" stroke="' + ac + '"/><text x="80" y="1265" fill="' + ac + '" font-size="24">' + str(i + 1) + ' / ' + str(len(post['slides'])) + '</text></svg>'
                file = postdir / ('tela-' + str(i + 1).zfill(2) + '.svg'); file.write_text(svg, encoding='utf8')
                assets.append({'file': file.relative_to(stage).as_posix(), 'width': 1080, 'height': 1350, 'kind': 'post'})
        (stage / 'projeto-fonte.json').write_text(dump(d), encoding='utf8')
        (stage / 'LEIA-ME.md').write_text('# ' + d['title'] + '\n\nVersão ' + version + '. Estado editorial: ' + d.get('status', 'proposta') + '.\n\nHTML editável, JSON editorial, bio, tokens e SVGs no kit. PDF, PNGs e QA são gerados em etapa posterior pelo renderizador. Não implica publicação ou aprovação factual.\n', encoding='utf8')
        files = {f.relative_to(stage).as_posix(): sha(f) for f in sorted(stage.rglob('*')) if f.is_file()}
        manifest = {'schema_version': 1, 'version': version, 'source_sha256': sha(data_path), 'slides': len(slides), 'assets': assets, 'bio_characters': len(d.get('bio', '')), 'bios_characters': {k: len(v) for k, v in d.get('bios', {}).items()}, 'files': files}
        (stage / 'manifesto-build.json').write_text(dump(manifest), encoding='utf8')
        stage.rename(dest)
        return {'version': str(dest), 'slides': len(slides), 'svg_assets': len(assets), 'status': 'construido; renderizar e revisar'}
    except BaseException:
        shutil.rmtree(stage)  # Somente staging criado por esta execução.
        raise

def check(folder):
    m = json.loads((folder / 'manifesto-build.json').read_text(encoding='utf8'))
    expected = dict(m['files'])
    render_file = folder / 'qa/render.json'
    render_status = 'nao_executado'
    if render_file.exists():
        r = json.loads(render_file.read_text(encoding='utf8'))
        render_status = r['status']
        if r.get('build_sha256') != sha(folder / 'manifesto-build.json'):
            raise ValueError('QA pertence a outro manifesto de construção.')
        expected.update(r.get('files', {}))
    errors = []
    for rel, digest in expected.items():
        file = inside(folder, rel)
        if not file.is_file() or sha(file) != digest: errors.append(rel)
    return {'files_checked': len(expected), 'hash_errors': errors, 'render_status': render_status}

def pack(folder, documents=()):
    result = check(folder)
    if result['hash_errors'] or result['render_status'] != 'passed':
        raise ValueError('Empacotamento requer hashes válidos e renderização aprovada: ' + dump(result))
    m = json.loads((folder / 'manifesto-build.json').read_text(encoding='utf8'))
    r = json.loads((folder / 'qa/render.json').read_text(encoding='utf8'))
    names = sorted(set(m['files']) | set(r['files']) | {'manifesto-build.json', 'qa/render.json'})
    manifest = {rel: sha(inside(folder, rel)) for rel in names}
    additions = {}
    for document in documents:
        file = document.resolve()
        if not file.is_file() or file.suffix.lower() not in {'.md', '.txt', '.csv', '.json', '.pdf', '.html'}:
            raise ValueError('Documento explícito ausente ou formato não suportado: ' + str(file))
        rel = 'documentos/' + file.name
        if rel in additions or rel in names:
            raise ValueError('Nomes de documentos duplicados no pacote: ' + file.name)
        additions[rel] = file
        manifest[rel] = sha(file)
    dest = folder.with_suffix('.zip')
    with zipfile.ZipFile(dest, 'x', compression=zipfile.ZIP_DEFLATED) as z:
        for rel in names: z.write(inside(folder, rel), arcname=folder.name + '/' + rel)
        for rel, file in additions.items(): z.write(file, arcname=folder.name + '/' + rel)
        z.writestr(folder.name + '/INVENTARIO-SHA256.json', dump(manifest))
    with zipfile.ZipFile(dest) as z:
        if z.testzip(): raise ValueError('Falha de CRC no pacote.')
    return {'zip': str(dest), 'files': len(names) + len(additions) + 1, 'sha256': sha(dest)}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    p = sub.add_parser('init'); p.add_argument('project', type=Path); p.add_argument('--name', required=True)
    p = sub.add_parser('build'); p.add_argument('project', type=Path); p.add_argument('--version', required=True)
    for command in ['check', 'pack']:
        p = sub.add_parser(command); p.add_argument('folder', type=Path)
        if command == 'pack': p.add_argument('--document', type=Path, action='append', default=[])
    a = parser.parse_args()
    try:
        if a.command == 'init': result = init(a.project.resolve(), a.name)
        elif a.command == 'build': result = build(a.project.resolve(), a.version)
        elif a.command == 'check':
            result = check(a.folder.resolve())
            print(dump(result), end='')
            return 1 if result['hash_errors'] or result['render_status'] == 'failed' else 0
        else: result = pack(a.folder.resolve(), a.document)
        print(dump(result), end='')
        return 0
    except (ValueError, KeyError, OSError, TypeError) as error:
        parser.exit(1, 'Erro: ' + str(error) + '\n')

if __name__ == '__main__':
    raise SystemExit(main())
