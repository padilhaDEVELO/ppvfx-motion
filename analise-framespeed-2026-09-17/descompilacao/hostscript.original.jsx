/*
* Decompiled with Jsxer
* Version: 1.7.4
* JSXBIN 2.0
*/

function _buildFontCache() {
if (_fontNamesCache !== null) { 
return;
}
_fontNamesCache = {};
try {
if ((app.fonts) && (app.fonts.length > 0)) { 
for (var i = 0; i < app.fonts.length; i += 1) { 
var f = app.fonts[i];
if ((!f) || (!f.postScriptName)) { 
continue ;
}
var fam = null;
var sty = null;
try {
fam = (f.family) || (null);
} catch (ef) {
}
try {
sty = (f.style) || (null);
} catch (ef) {
}
_fontNamesCache[f.postScriptName] = {family: fam, style: sty};}
}
} catch (e) {_fontNamesCache = null;
return;
}
var _cacheHasAny = false;
for (var _ck in _fontNamesCache) { 
_cacheHasAny = true;
break ;
}
if (!_cacheHasAny) { 
_fontNamesCache = null;
}
}
function _resolveFont(fontName) {
if ((!fontName) || (fontName === "")) { 
return null;
}
_buildFontCache();
var candidates = [fontName, fontName.replace(/\s+/g, "-"), fontName.replace(/\s+/g, ""), fontName.replace(/-/g, " "), fontName.replace(/-/g, ""), fontName.replace(/[-_\s]/g, ""), fontName.replace(/\s*(Regular|Normal|Roman|Book)$/i, "").replace(/\s+/g, "-").trim(), fontName.replace(/\s*(Regular|Normal|Roman|Book)$/i, "").replace(/-/g, " ").trim()];
if (_fontNamesCache === null) { 
return (candidates[0]) || (null);
}
for (var ci = 0; ci < candidates.length; ci += 1) { 
var c = candidates[ci];
if ((c) && (_fontNamesCache.hasOwnProperty(c))) { 
return c;
}}
return fontName;
}
function _getFontFamilyStyle(psName) {
var entry = (_fontNamesCache) && (_fontNamesCache.hasOwnProperty(psName)) ? _fontNamesCache[psName] : null;
if ((entry) && (entry.family)) { 
family = entry.family;
style = (entry.style) || ("Regular");
}
else {
family = psName;
style = "Regular";
var lastDash = psName.lastIndexOf("-");
if (lastDash > 0) { 
family = psName.substring(0, lastDash);
style = psName.substring(lastDash + 1);
}
family = family.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").trim();
style = style.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").trim();
}
return {family: family, style: style};
}
function _resolveFontByFamilyStyle(family, style) {
_buildFontCache();
if (_fontNamesCache === null) { 
return null;
}
if (!family) { 
return null;
}
var famLc = ("" + family).toLowerCase().replace(/\s+/g, "");
var styLc = ("" + (style) || ("")).toLowerCase().replace(/\s+/g, "");
var familyOnly = null;
for (var ps in _fontNamesCache) { 
if (!_fontNamesCache.hasOwnProperty(ps)) { 
continue ;
}
var e = _fontNamesCache[ps];
if ((!e) || (!e.family)) { 
continue ;
}
var efam = ("" + e.family).toLowerCase().replace(/\s+/g, "");
if (efam !== famLc) { 
continue ;
}
var esty = ("" + (e.style) || ("")).toLowerCase().replace(/\s+/g, "");
if ((styLc) && (esty === styLc)) { 
return ps;
}
if ((!styLc) && ((esty === "regular") || (esty === ""))) { 
return ps;
}
if (!familyOnly) { 
familyOnly = ps;
}
}
return familyOnly;
}
function _resolveFontSmart(psName, family, style) {
_buildFontCache();
if (((psName) && (_fontNamesCache)) && (_fontNamesCache.hasOwnProperty(psName))) { 
return psName;
}
var byFam = _resolveFontByFamilyStyle(family, style);
if (byFam) { 
return byFam;
}
return _resolveFont(psName);
}
function getAvailableFonts() {
try {
var fonts = [];
for (var i = 0; i < app.fonts.length; i += 1) { 
try {
var f = app.fonts[i];
if ((f) && (f.postScriptName)) { 
fonts.push(f.postScriptName);
}
} catch (ef) {
}}
fonts.sort();
return _fsJSON.stringify(fonts);
} catch (e) {return _fsJSON.stringify([]);
}
}
function hexToAeColor(hex) {
hex = hex.replace("#", "");
if (hex.length === 3) { 
hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
}
return [parseInt(hex.substring(0, 2), 16) / 255, parseInt(hex.substring(2, 4), 16) / 255, parseInt(hex.substring(4, 6), 16) / 255];
}
function _applyCustomStylingToLayer(hlLayer, stylesEnabled, highlightColor, supportColor, fontHighlight, fontSupport, fontsEnabled, fontHighlightFamily, fontHighlightStyle, fontSupportFamily, fontSupportStyle, forceHighlight) {
if (((!stylesEnabled) && (!fontsEnabled)) || (!(hlLayer instanceof TextLayer))) { 
return;
}
fontHighlightFamily = (fontHighlightFamily) || ("");
fontHighlightStyle = (fontHighlightStyle) || ("");
fontSupportFamily = (fontSupportFamily) || ("");
fontSupportStyle = (fontSupportStyle) || ("");
try {
var aeHighlightColor = (stylesEnabled) && (highlightColor !== "") ? hexToAeColor(highlightColor) : null;
var aeSupportColor = (stylesEnabled) && (supportColor !== "") ? hexToAeColor(supportColor) : null;
var anyFontSet = (fontsEnabled) && ((fontHighlight !== "") || (fontSupport !== ""));
var effects = hlLayer.property("ADBE Effect Parade");
var isWhiteByEffect = true;
if ((effects) && (effects.numProperties > 0)) { 
for (var e = 1; e <= effects.numProperties; e += 1) { 
var layerEffect = effects.property(e);
if (layerEffect.matchName === "ADBE Fill") { 
var fillColProp = layerEffect.property("ADBE Fill-0002");
if (fillColProp) { 
var fc = fillColProp.value;
isWhiteByEffect = ((fc[0] > 0.95) && (fc[1] > 0.95)) && (fc[2] > 0.95);
var isHighlightEff = !isWhiteByEffect;
var efColorToSet = isHighlightEff ? aeHighlightColor : aeSupportColor;
if (efColorToSet) { 
fillColProp.setValue(efColorToSet);
}
}
}}
}
var hlProp = hlLayer.property("Source Text");
var hlDoc = hlProp.value;
var characterColor = hlDoc.fillColor;
var isWhiteText = ((characterColor[0] > 0.95) && (characterColor[1] > 0.95)) && (characterColor[2] > 0.95);
var isHighlight = (!isWhiteText) || (!isWhiteByEffect);
var lName = hlLayer.name.toLowerCase();
if (((lName.indexOf("apoio") !== -1) || (lName.indexOf("fino") !== -1)) || (lName.indexOf("secund") !== -1)) { 
isHighlight = false;
}
else if (((lName.indexOf("destaque") !== -1) || (lName.indexOf("bold") !== -1)) || (lName.indexOf("principal") !== -1)) {
isHighlight = true;
}
else {
var _tnum = lName.match(/text[o]?\s*(\d+)/);
if (_tnum) { 
isHighlight = parseInt(_tnum[1], 10) === 1;
}
}
if ((forceHighlight === true) || (forceHighlight === false)) { 
isHighlight = forceHighlight;
}
var selectedFont = isHighlight ? fontHighlight : fontSupport;
var selectedFamily = isHighlight ? fontHighlightFamily : fontSupportFamily;
var selectedStyle = isHighlight ? fontHighlightStyle : fontSupportStyle;
if ((selectedFont === "") && (selectedFamily === "")) { 
selectedFont = isHighlight ? fontSupport : fontHighlight;
selectedFamily = isHighlight ? fontSupportFamily : fontHighlightFamily;
selectedStyle = isHighlight ? fontSupportStyle : fontHighlightStyle;
}
var changed = false;
var colorToSet = isHighlight ? aeHighlightColor : aeSupportColor;
if ((stylesEnabled) && (colorToSet)) { 
hlDoc.fillColor = colorToSet;
changed = true;
}
if ((fontsEnabled) && ((selectedFont !== "") || (selectedFamily !== ""))) { 
var resolvedFont = _resolveFontSmart(selectedFont, selectedFamily, selectedStyle);
if (resolvedFont) { 
try {
hlDoc.font = resolvedFont;
try {
if (hlDoc.font !== resolvedFont) { 
var alt = _resolveFontByFamilyStyle(selectedFamily, selectedStyle);
if (alt) { 
hlDoc.font = alt;
}
}
} catch (eVerify) {
}
changed = true;
} catch (efont) {
}
}
}
if (changed) { 
hlProp.setValue(hlDoc);
}
} catch (eStyling) {
}
}
function _findBestAudioTrackForTime(seq, startTimeSeconds) {
if ((!seq) || (!seq.audioTracks)) { 
return 0;
}
var numTracks = seq.audioTracks.numTracks;
for (var i = 0; i < numTracks; i += 1) { 
var track = seq.audioTracks[i];
var clips = track.clips;
var isOccupied = false;
for (var c = 0; c < clips.numItems; c += 1) { 
var clip = clips[c];
if ((startTimeSeconds >= clip.start.seconds) && (startTimeSeconds < clip.end.seconds)) { 
isOccupied = true;
break ;
}}
if (!isOccupied) { 
return i;
}}
return 0;
}
function applyPresetBatchAE(jsonStringArgs) {
try {
var args = _fsJSON.parse(jsonStringArgs);
var ffxPath = args.ffxPath;
var proj = app.project;
if (!proj) { 
return "Erro: Nenhum projeto aberto.";
}
var comp = proj.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
return "Erro: Selecione uma composi\xe7\xe3o primeiro.";
}
var selectedLayers = comp.selectedLayers;
if (selectedLayers.length < 1) { 
return "Erro: Nenhuma camada selecionada.\nSelecione as camadas de texto na timeline.";
}
app.beginUndoGroup("Aplicar Preset em Lote");
var count = 0;
var ffxFile = new File(ffxPath);
if (!ffxFile.exists) { 
app.endUndoGroup();
return "Erro: O preset n\xe3o foi encontrado no caminho: " + ffxPath;
}
for (var d = 1; d <= comp.numLayers; d += 1) { 
comp.layer(d).selected = false;}
for (var i = 0; i < selectedLayers.length; i += 1) { 
var layer = selectedLayers[i];
try {
layer.selected = true;
comp.time = layer.inPoint;
layer.applyPreset(ffxFile);
layer.selected = false;
count++;
} catch (e) {
}}
app.endUndoGroup();
return "Sucesso: Aplicado em " + count + " camadas.";
} catch (err) {return "Erro fatal: " + err.toString();
}
}
function stackSelectedTexts(jsonStringArgs) {
var args = _fsJSON.parse(jsonStringArgs);
var spacing = (args.spacing !== undefined) && (args.spacing !== null) ? Number(args.spacing) : 25;
var direction = (args.direction) || ("down");
var dynamicStyle = (args.dynamicStyle) || ("bottom");
var templateFolder = (args.templateFolder) || ("Template 1");
var templateName = templateFolder.split("/").pop();
var presetApoio = args.presetApoio;
var presetDestaque = args.presetDestaque;
var assetFile = args.assetFile;
var aepFile = args.aepFile;
var assetPos = (args.assetPos) || ("bottom");
var assetSync = (args.assetSync) || ("start");
var extractElements = (args.extractElements) || (false);
var preserveFonts = (args.preserveFonts) || (false);
var extPath = args.extPath;
var highlightColor = (args.highlightColor) || ("");
var fontFamily = (args.fontFamily) || ("");
var stylesEnabled = args.stylesEnabled === true;
var proj = app.project;
if (!proj) { 
alert("Nenhum projeto aberto.");
return "ERRO";
}
var comp = proj.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
alert("Selecione uma composi\xe7\xe3o primeiro.");
return "ERRO";
}
var selectedLayers = comp.selectedLayers;
if (selectedLayers.length < 1) { 
alert("Please select some layers.\n(Selecione pelo menos 1 camada de TEXTO na timeline)");
return "ERRO";
}
var undoStarted = false;
try {
var textLayers = [];
for (var i = 0; i < selectedLayers.length; i += 1) { 
var layer = selectedLayers[i];
if (layer instanceof TextLayer) { 
textLayers.push(layer);
}}
if (textLayers.length < 1) { 
alert("Nenhuma camada de TEXTO foi selecionada. O script precisa de pelo menos 1 camada.");
return "ERRO";
}
textLayers.sort(function (a, b) {
return a.inPoint - b.inPoint;
});
var maxOutPoint = 0;
for (var m = 0; m < textLayers.length; m += 1) { 
if (textLayers[m].outPoint > maxOutPoint) { 
maxOutPoint = textLayers[m].outPoint;
}}
if ((((args.audioEnabled) && (assetFile)) && (assetFile !== "null")) && (assetFile !== "")) { 
var isAudio = /\.(mp3|wav|m4a|aac|aif|aiff)$/i.test(assetFile);
if (isAudio) { 
var fullAudioPath = extPath + "/templates/" + templateFolder + "/" + assetFile;
var audioObj = new File(fullAudioPath);
if (audioObj.exists) { 
var importedAudio = null;
for (var f = 1; f <= proj.numItems; f += 1) { 
if ((proj.item(f).name === audioObj.name) && (proj.item(f) instanceof FootageItem)) { 
importedAudio = proj.item(f);
break ;
}}
if (!importedAudio) { 
try {
var importOptions = new ImportOptions(audioObj);
importedAudio = proj.importFile(importOptions);
} catch (e) {
}
}
if (importedAudio) { 
var audioLayer = comp.layers.add(importedAudio);
audioLayer.startTime = textLayers[0].inPoint;
audioLayer.moveToEnd();
assetFile = "";
}
}
}
}
if ((aepFile) && (aepFile !== "")) { 
var fullAepPath = aepFile;
if (((fullAepPath.indexOf("/") !== 0) && (fullAepPath.indexOf(":\\") === -1)) && (fullAepPath.indexOf(":/") === -1)) { 
fullAepPath = extPath + "/templates/" + templateFolder + "/" + aepFile;
}
fullAepPath = fullAepPath.replace(/\\/g, "/");
var aepFileObj = new File(fullAepPath);
if (!aepFileObj.exists) { 
var aDir = aepFileObj.parent;
if ((aDir) && (aDir.exists)) { 
var aFiles = aDir.getFiles("*.aep");
if ((aFiles) && (aFiles.length > 0)) { 
aepFileObj = aFiles[0];
fullAepPath = aepFileObj.fsName;
}
}
}
if (!aepFileObj.exists) { 
var modelName = templateFolder ? templateFolder.split("/").pop() : "Modelo selecionado";
return "Erro: O " + modelName + " n\xe3o foi encontrado ou est\xe1 corrompido.";
}
var startInPoint = textLayers[0].inPoint;
var baseLayer = textLayers[0];
var basePos = baseLayer.property("ADBE Transform Group").property("ADBE Position").value;
var baseAnc = baseLayer.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var baseRect = baseLayer.sourceRectAtTime(baseLayer.inPoint, false);
var baseSca = baseLayer.property("ADBE Transform Group").property("ADBE Scale").value;
var origX = basePos[0] + (((baseRect.left + (baseRect.width / 2)) - baseAnc[0]) * (baseSca[0] / 100));
var origY = basePos[1] + (((baseRect.top + (baseRect.height / 2)) - baseAnc[1]) * (baseSca[1] / 100));
var userFont = null;
if ((preserveFonts) && (textLayers[0] instanceof TextLayer)) { 
var firstTextProp = textLayers[0].property("Source Text").value;
userFont = firstTextProp.font;
}
var userTexts = [];
for (var t = 0; t < textLayers.length; t += 1) { 
userTexts.push(textLayers[t].property("Source Text").value.text);}
var importOptions = new ImportOptions(aepFileObj);
var importedFolder = proj.importFile(importOptions);
if (!importedFolder) { 
return "Erro: Falha ao importar o Template AEP.";
}
app.beginUndoGroup("Stack Texts (AEP)");
undoStarted = true;
var masterComp = null;
for (var i = 1; i <= importedFolder.numItems; i += 1) { 
var item = importedFolder.item(i);
if (item instanceof CompItem) { 
masterComp = item;
break ;
}}
if (!masterComp) { 
if (undoStarted) { 
app.endUndoGroup();
}
return "Erro: Nenhuma Composi\xe7\xe3o encontrada dentro do Template AEP importado.";
}
var templateTextCount = 0;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
if ((masterComp.layer(m) instanceof TextLayer) && (masterComp.layer(m).name.toUpperCase().indexOf("TEXTO ") === 0)) { 
templateTextCount++;
}}
var isSingleTextTemplate = templateTextCount === 1;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
var templateLayer = masterComp.layer(m);
if (templateLayer instanceof TextLayer) { 
var layerName = templateLayer.name.toUpperCase();
var replaced = false;
if ((isSingleTextTemplate) && (layerName === "TEXTO 1")) { 
var fraseCompleta = userTexts.join(" ");
var prop = templateLayer.property("Source Text");
var doc = prop.value;
doc.text = fraseCompleta;
if ((preserveFonts) && (userFont)) { 
doc.font = userFont;
}
prop.setValue(doc);
templateLayer.customUserInPoint = textLayers[0].inPoint;
replaced = true;
}
else {
for (var r = 0; r < userTexts.length; r += 1) { 
var tagAlvo = "TEXTO " + r + 1;
if (layerName === tagAlvo) { 
var prop = templateLayer.property("Source Text");
var doc = prop.value;
doc.text = userTexts[r];
if ((preserveFonts) && (userFont)) { 
doc.font = userFont;
}
prop.setValue(doc);
templateLayer.customUserInPoint = textLayers[r].inPoint;
replaced = true;
break ;
}}
}
if ((!replaced) && (layerName.indexOf("TEXTO ") === 0)) { 
templateLayer.enabled = false;
}
}}
var tmplX = masterComp.width / 2;
var tmplY = masterComp.height / 2;
var templateTexto1 = null;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
var layerInside = masterComp.layer(m);
if ((layerInside instanceof TextLayer) && (layerInside.name.toUpperCase() === "TEXTO 1")) { 
templateTexto1 = layerInside;
break ;
}}
if (templateTexto1) { 
try {
var tPos = templateTexto1.property("ADBE Transform Group").property("ADBE Position").value;
var tAnc = templateTexto1.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var tRect = templateTexto1.sourceRectAtTime(0, false);
var tSca = templateTexto1.property("ADBE Transform Group").property("ADBE Scale").value;
var absX = tPos[0];
var absY = tPos[1];
if (templateTexto1.parent) { 
var pPos = templateTexto1.parent.property("ADBE Transform Group").property("ADBE Position").value;
var pAnc = templateTexto1.parent.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var pSca = templateTexto1.parent.property("ADBE Transform Group").property("ADBE Scale").value;
absX = pPos[0] + ((absX - pAnc[0]) * (pSca[0] / 100));
absY = pPos[1] + ((absY - pAnc[1]) * (pSca[1] / 100));
}
tmplX = absX + (((tRect.left + (tRect.width / 2)) - tAnc[0]) * (tSca[0] / 100));
tmplY = absY + (((tRect.top + (tRect.height / 2)) - tAnc[1]) * (tSca[1] / 100));
} catch (e) {
}
}
var finalLayer = comp.layers.add(masterComp);
var temporalOffset = startInPoint - masterComp.displayStartTime;
finalLayer.startTime = temporalOffset;
finalLayer.moveBefore(textLayers[0]);
finalLayer.outPoint = maxOutPoint;
try {
var fPosProp = finalLayer.property("ADBE Transform Group").property("ADBE Position");
var fAnc = finalLayer.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var TargetFinalPosX = (origX + fAnc[0]) - tmplX;
var TargetFinalPosY = (origY + fAnc[1]) - tmplY;
fPosProp.setValue([TargetFinalPosX, TargetFinalPosY]);
var safeMargin = comp.width * 0.08;
var fRect = finalLayer.sourceRectAtTime(startInPoint, false);
var fScaProp = finalLayer.property("ADBE Transform Group").property("ADBE Scale");
var currentSca = fScaProp.value;
var visualLeft = TargetFinalPosX + ((fRect.left - fAnc[0]) * (currentSca[0] / 100));
var visualRight = TargetFinalPosX + (((fRect.left + fRect.width) - fAnc[0]) * (currentSca[0] / 100));
var excessLeft = safeMargin - visualLeft;
var excessRight = visualRight - (comp.width - safeMargin);
var maxExcess = Math.max(0, excessLeft, excessRight);
if (maxExcess > 0) { 
var currentWidth = visualRight - visualLeft;
var targetMaxWidth = comp.width - (safeMargin * 2);
var scaleFactor = targetMaxWidth / currentWidth;
if (scaleFactor < 1) { 
fScaProp.setValue([currentSca[0] * scaleFactor, currentSca[1] * scaleFactor]);
}
}
} catch (e) {
}
try {
var nullLayer = comp.layers.addNull();
nullLayer.name = "CTRL \u2014 " + templateName;
nullLayer.startTime = startInPoint;
nullLayer.outPoint = maxOutPoint;
nullLayer.moveBefore(finalLayer);
try {
var tPos = finalLayer.property("ADBE Transform Group").property("ADBE Position").value;
nullLayer.property("ADBE Transform Group").property("ADBE Position").setValue(tPos);
finalLayer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
} catch (ePosNull) {
}
finalLayer.parent = nullLayer;
} catch (eNull) {
}
if (extractElements) { 
function updateExpressionNames(propGroup, mapping) {
for (var rProp = 1; rProp <= propGroup.numProperties; rProp += 1) { 
var cProp = propGroup.property(rProp);
if (cProp.propertyType === PropertyType.PROPERTY) { 
if ((cProp.canSetExpression) && (cProp.expression !== "")) { 
var expr = cProp.expression;
var changed = false;
for (var oldName in mapping) { 
var newName = mapping[oldName];
if (oldName === newName) { 
continue ;
}
var safeOldName = oldName.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
var regex1 = new RegExp("layer\\(\\s*\"" + safeOldName + "\"\\s*\\)", "g");
var regex2 = new RegExp("layer\\(\\s*\'" + safeOldName + "\'\\s*\\)", "g");
if ((regex1.test(expr)) || (regex2.test(expr))) { 
expr = expr.replace(regex1, "layer(\"" + newName + "\")");
expr = expr.replace(regex2, "layer(\'" + newName + "\')");
changed = true;
}
}
if (changed) { 
try {
cProp.expression = expr;
} catch (e) {
}
}
}
}
else {
if ((cProp.propertyType === PropertyType.INDEXED_GROUP) || (cProp.propertyType === PropertyType.NAMED_GROUP)) { 
updateExpressionNames(cProp, mapping);
}
}}
}
for (var d = 1; d <= comp.numLayers; d += 1) { 
comp.layer(d).selected = false;}
var extractedLayers = [];
var nameMap = {};
var uniqueSuffix = " #" + Math.round(Math.random() * 8999) + 1000;
for (var j = 1; j <= masterComp.numLayers; j += 1) { 
function scanKeys(p) {
if (p.numProperties) { 
for (var i = 1; i <= p.numProperties; i += 1) { 
scanKeys(p.property(i));}
}
else {
if ((p.canVaryOverTime) && (p.numKeys > 0)) { 
var firstT = p.keyTime(1);
var lastT = p.keyTime(p.numKeys);
if (firstT < minK) { 
minK = firstT;
}
if (lastT > maxK) { 
maxK = lastT;
}
}
}
}
var layerInside = masterComp.layer(j);
var _lnNull = (layerInside.name) || ("").toLowerCase();
if ((layerInside.nullLayer) && ((_lnNull.indexOf("tracking") !== -1) || (_lnNull.indexOf("tracker") !== -1))) { 
continue ;
}
if (((!(layerInside instanceof TextLayer)) && (!layerInside.nullLayer)) && (_lnNull.indexOf("controlador") === -1)) { 
continue ;
}
var oldName = layerInside.name;
var uniqueName = oldName + uniqueSuffix;
if (!nameMap[oldName]) { 
nameMap[oldName] = uniqueName;
}
var wasLocked = layerInside.locked;
if (wasLocked) { 
layerInside.locked = false;
}
var origParent = layerInside.parent;
if (origParent) { 
layerInside.parent = null;
}
var exprBackups = [];
var stripFn = function (pGroup) {
for (var i = 1; i <= pGroup.numProperties; i += 1) { 
var p = pGroup.property(i);
if ((p.propertyType === PropertyType.PROPERTY) && (p.canSetExpression)) { 
if (p.expression !== "") { 
exprBackups.push({enabled: p.expressionEnabled, expr: p.expression, prop: p});
p.expression = "";
}
}
else {
if ((p.propertyType === PropertyType.INDEXED_GROUP) || (p.propertyType === PropertyType.NAMED_GROUP)) { 
stripFn(p);
}
}}
};
stripFn(layerInside);
layerInside.copyToComp(comp);
var newLayer = comp.layer(1);
if (origParent) { 
layerInside.parent = origParent;
}
if (wasLocked) { 
layerInside.locked = true;
}
for (var x = 0; x < exprBackups.length; x += 1) { 
var b = exprBackups[x];
b.prop.expression = b.expr;
b.prop.expressionEnabled = b.enabled;}
var copyFn = function (oG, nG) {
for (var i = 1; i <= oG.numProperties; i += 1) { 
var oP = oG.property(i);
var nP = nG.property(i);
if ((!oP) || (!nP)) { 
continue ;
}
if ((oP.propertyType === PropertyType.PROPERTY) && (oP.canSetExpression)) { 
if (oP.expression !== "") { 
nP.expression = oP.expression;
nP.expressionEnabled = oP.expressionEnabled;
}
}
else {
if ((oP.propertyType === PropertyType.INDEXED_GROUP) || (oP.propertyType === PropertyType.NAMED_GROUP)) { 
copyFn(oP, nP);
}
}}
};
copyFn(layerInside, newLayer);
try {
newLayer.name = (nameMap[oldName]) || (uniqueName);
} catch (e) {
}
extractedLayers[j] = {newL: newLayer, orig: layerInside, wasLocked: wasLocked};
newLayer.moveBefore(finalLayer);
var targetIn = startInPoint;
if (layerInside.customUserInPoint !== undefined) { 
targetIn = layerInside.customUserInPoint;
}
var targetOut = maxOutPoint;
var targetDuration = targetOut - targetIn;
if (targetDuration <= 0) { 
targetDuration = 0.5;
}
var oldIn = layerInside.inPoint;
var oldOut = layerInside.outPoint;
var oldDuration = oldOut - oldIn;
if (oldDuration <= 0) { 
oldDuration = 0.5;
}
var minK = 999999;
var maxK = -999999;
scanKeys(layerInside);
var activeDuration = oldDuration;
var baseTime = oldIn;
if ((minK !== 999999) && (maxK !== -999999)) { 
activeDuration = maxK - minK;
if (activeDuration <= 0.01) { 
activeDuration = 0.1;
}
baseTime = minK;
}
var stretchFactor = targetDuration / activeDuration;
newLayer.stretch = stretchFactor * 100;
newLayer.startTime = targetIn - ((baseTime - layerInside.startTime) * stretchFactor);
newLayer.outPoint = targetOut;}
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if (!extractedLayers[k]) { 
continue ;
}
var origL = extractedLayers[k].orig;
var newL = extractedLayers[k].newL;
if (origL.parent) { 
var pIndex = origL.parent.index;
if (extractedLayers[pIndex]) { 
newL.parent = extractedLayers[pIndex].newL;
}
}
try {
updateExpressionNames(newL, nameMap);
} catch (e) {
}
var origEffects = origL.property("ADBE Effect Parade");
var newEffects = newL.property("ADBE Effect Parade");
if (((origEffects) && (newEffects)) && (origEffects.numProperties > 0)) { 
for (var e = 1; e <= origEffects.numProperties; e += 1) { 
var origEffect = origEffects.property(e);
var newEffect = newEffects.property(e);
if ((!origEffect) || (!newEffect)) { 
continue ;
}
for (var p = 1; p <= origEffect.numProperties; p += 1) { 
var origProp = origEffect.property(p);
var newProp = newEffect.property(p);
if ((!origProp) || (!newProp)) { 
continue ;
}
try {
if (origProp.propertyValueType === PropertyValueType.LAYER_INDEX) { 
var origTargetIndex = origProp.value;
if ((origTargetIndex > 0) && (extractedLayers[origTargetIndex])) { 
var targetNewLayer = extractedLayers[origTargetIndex].newL;
newProp.setValue(targetNewLayer.index);
}
}
} catch (err) {
}}}
}
try {
if ((origL.hasTrackMatte) && (origL.trackMatteLayer)) { 
var tmIndex = origL.trackMatteLayer.index;
if ((tmIndex > 0) && (extractedLayers[tmIndex])) { 
newL.trackMatteLayer = extractedLayers[tmIndex].newL;
}
}
} catch (err) {
}}
for (var j = 1; j <= masterComp.numLayers; j += 1) { 
if (!extractedLayers[j]) { 
continue ;
}
var newLayer = extractedLayers[j].newL;
if ((!newLayer.enabled) && (newLayer.name.toUpperCase().indexOf("TEXTO ") !== -1)) { 
try {
newLayer.remove();
} catch (err) {
}
}}
try {
var alignmentNull = comp.layers.addNull();
alignmentNull.name = "CONTROLE: " + templateName;
alignmentNull.label = 13;
alignmentNull.startTime = startInPoint;
alignmentNull.outPoint = maxOutPoint;
alignmentNull.property("ADBE Transform Group").property("ADBE Position").setValue([tmplX, tmplY]);
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if (!extractedLayers[k]) { 
continue ;
}
var newL = extractedLayers[k].newL;
if ((newL) && (newL.parent === null)) { 
try {
newL.parent = alignmentNull;
} catch (e) {
}
}}
alignmentNull.property("ADBE Transform Group").property("ADBE Position").setValue([origX, origY]);
var safeMargin = comp.width * 0.08;
var minLeft = 99999;
var maxRight = -99999;
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if (!extractedLayers[k]) { 
continue ;
}
var childL = extractedLayers[k].newL;
var cRect = childL.sourceRectAtTime(startInPoint, true);
try {
var topLeft = childL.toComp([cRect.left, cRect.top]);
var topRight = childL.toComp([cRect.left + cRect.width, cRect.top]);
var bottomLeft = childL.toComp([cRect.left, cRect.top + cRect.height]);
var bottomRight = childL.toComp([cRect.left + cRect.width, cRect.top + cRect.height]);
minLeft = Math.min(minLeft, topLeft[0], bottomLeft[0], topRight[0], bottomRight[0]);
maxRight = Math.max(maxRight, topRight[0], bottomRight[0], topLeft[0], bottomLeft[0]);
} catch (e) {
}}
if ((minLeft !== 99999) && (maxRight !== -99999)) { 
var excessLeft = safeMargin - minLeft;
var excessRight = maxRight - (comp.width - safeMargin);
var maxExcess = Math.max(0, excessLeft, excessRight);
if (maxExcess > 0) { 
var currentTotalWidth = maxRight - minLeft;
var targetTotalWidth = comp.width - (safeMargin * 2);
if (currentTotalWidth > 0) { 
var scaleFactor = targetTotalWidth / currentTotalWidth;
if (scaleFactor < 1) { 
var nullSca = alignmentNull.property("ADBE Transform Group").property("ADBE Scale").value;
alignmentNull.property("ADBE Transform Group").property("ADBE Scale").setValue([nullSca[0] * scaleFactor, nullSca[1] * scaleFactor]);
}
}
}
}
for (var fi = 1; fi <= masterComp.numLayers; fi += 1) { 
if (extractedLayers[fi]) { 
alignmentNull.moveBefore(extractedLayers[fi].newL);
break ;
}}
alignmentNull.selected = true;
} catch (e) {
}
for (var r = 1; r <= masterComp.numLayers; r += 1) { 
if ((extractedLayers[r]) && (extractedLayers[r].wasLocked)) { 
try {
extractedLayers[r].newL.locked = true;
} catch (err) {
}
}}
try {
finalLayer.selected = false;
finalLayer.remove();
} catch (e) {
}
}
for (var t = 0; t < textLayers.length; t += 1) { 
try {
textLayers[t].selected = false;
textLayers[t].remove();
} catch (e) {
}}
var allLayers = extractElements ? comp : masterComp;
var numL = allLayers.numLayers;
for (var hl = 1; hl <= numL; hl += 1) { 
var fontHl = (args.fontHighlight) || ("");
var fontSp = (args.fontSupport) || ("");
var fontsOn = args.fontsEnabled === true;
var supportColor = (args.supportColor) || ("");
_applyCustomStylingToLayer(allLayers.layer(hl), stylesEnabled, highlightColor, supportColor, fontHl, fontSp, fontsOn);}
var msg = extractElements ? "Template Importado e Elementos Extra\xeddos para Timeline!" : "Template (AEP) Aplicado com Sucesso!";
_deleteControlLayers(comp);
if (undoStarted) { 
app.endUndoGroup();
}
return msg;
}
var isFraseLogic = (templateName.indexOf("Template 2") !== -1) || (templateFolder.toLowerCase().indexOf("frases") !== -1);
if (isFraseLogic) { 
app.beginUndoGroup("Stack Texts (Frase)");
undoStarted = true;
var baseLayer = textLayers[0];
var startInPoint = baseLayer.inPoint;
var baseT2Doc = baseLayer.property("Source Text").value;
var originalFontSize = baseT2Doc.fontSize;
var originalFont = baseT2Doc.font;
var fraseCompleta = "";
for (var t = 0; t < textLayers.length; t += 1) { 
fraseCompleta += textLayers[t].property("Source Text").value.text + " ";
textLayers[t].remove();}
fraseCompleta = fraseCompleta.replace(/\s+$/, "");
var t2Layer = comp.layers.addText(fraseCompleta);
t2Layer.name = "TEMPLATE FRASE MESCLADA";
t2Layer.inPoint = startInPoint;
t2Layer.outPoint = maxOutPoint;
var t2Prop = t2Layer.property("Source Text");
var t2Doc = t2Prop.value;
t2Doc.fontSize = originalFontSize;
t2Doc.justification = ParagraphJustification.CENTER_JUSTIFY;
t2Doc.tracking = -20;
if ((preserveFonts) && (originalFont)) { 
t2Doc.font = originalFont;
t2Doc.fontSize = originalFontSize;
}
t2Prop.setValue(t2Doc);
var maxWidth = comp.width * 0.8;
var palavras = fraseCompleta.split(" ");
var linhasFormatadas = "";
var linhaAtual = "";
var tempLayer = comp.layers.addText("");
var tempProp = tempLayer.property("Source Text");
for (var p = 0; p < palavras.length; p += 1) { 
var linhaTeste = linhaAtual + palavras[p] + " ";
var tempDoc = tempProp.value;
tempDoc.text = linhaTeste;
tempDoc.fontSize = originalFontSize;
tempProp.setValue(tempDoc);
var tRect = tempLayer.sourceRectAtTime(comp.time, false);
if ((tRect.width > maxWidth) && (p > 0)) { 
linhasFormatadas += linhaAtual.replace(/\s+$/, "") + "\r";
linhaAtual = palavras[p] + " ";
}
else {
linhaAtual = linhaTeste;
}}
linhasFormatadas += linhaAtual.replace(/\s+$/, "");
tempLayer.remove();
t2Doc.text = linhasFormatadas;
t2Prop.setValue(t2Doc);
t2Layer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
var hasDestaqueT2 = (presetDestaque) && (presetDestaque !== "none");
var fileDestaqueT2 = hasDestaqueT2 ? new File(extPath + "/templates/" + templateFolder + "/" + presetDestaque) : null;
for (var d = 1; d <= comp.numLayers; d += 1) { 
comp.layer(d).selected = false;}
if ((fileDestaqueT2) && (fileDestaqueT2.exists)) { 
for (var d = 1; d <= comp.numLayers; d += 1) { 
comp.layer(d).selected = false;}
t2Layer.selected = true;
comp.time = t2Layer.inPoint;
t2Layer.applyPreset(fileDestaqueT2);
t2Layer.selected = false;
}
var msg = "Template (Frase) Aplicado (Mesclado, Quebrado e Antigas Apagadas)!";
_deleteControlLayers(comp);
if (undoStarted) { 
app.endUndoGroup();
}
return msg;
}
var importedAsset = null;
if (((assetFile) && (assetFile !== "null")) && (assetFile !== "")) { 
var fullAssetPath = extPath + "/templates/" + templateFolder + "/" + assetFile;
var assetObj = new File(fullAssetPath);
if (assetObj.exists) { 
for (var f = 1; f <= proj.numItems; f += 1) { 
if ((proj.item(f).name === assetObj.name) && (proj.item(f) instanceof FootageItem)) { 
importedAsset = proj.item(f);
break ;
}}
if (!importedAsset) { 
var importOptions = new ImportOptions(assetObj);
importedAsset = proj.importFile(importOptions);
}
}
}
app.beginUndoGroup("Stack Texts (Normal)");
undoStarted = true;
if (dynamicStyle !== "none") { 
var destaqueIndex = -1;
if (dynamicStyle === "bottom") { 
destaqueIndex = textLayers.length - 1;
}
else {
if (dynamicStyle === "top") { 
destaqueIndex = 0;
}
}
if (destaqueIndex !== -1) { 
var dLayer = textLayers[destaqueIndex];
var dProp = dLayer.property("Source Text");
var dDoc = dProp.value;
dDoc.fontSize = dDoc.fontSize * 1.35;
dDoc.fauxBold = true;
dDoc.tracking = 0;
dProp.setValue(dDoc);
var dRect = dLayer.sourceRectAtTime(dLayer.inPoint, false);
var dScale = dLayer.property("ADBE Transform Group").property("ADBE Scale").value;
var targetWidth = dRect.width * (dScale[0] / 100);
for (var v = 0; v < textLayers.length; v += 1) { 
if (v === destaqueIndex) { 
continue ;
}
var tl = textLayers[v];
var tProp = tl.property("Source Text");
var tDoc = tProp.value;
if (!preserveFonts) { 
var baseFontFamily = tDoc.font;
if (baseFontFamily.indexOf("-") !== -1) { 
baseFontFamily = baseFontFamily.split("-")[0];
}
var lightVariants = ["-Light", "-ExtraLight", "-Thin", "Light"];
for (var lw = 0; lw < lightVariants.length; lw += 1) { 
try {
tDoc.font = baseFontFamily + lightVariants[lw];
break ;
} catch (e) {
}}
}
tDoc.tracking = 0;
tProp.setValue(tDoc);
var tRect = tl.sourceRectAtTime(tl.inPoint, false);
var tScale = tl.property("ADBE Transform Group").property("ADBE Scale").value;
var currentWidth = tRect.width * (tScale[0] / 100);
if ((currentWidth > 0) && (targetWidth > 0)) { 
var scaleFactor = targetWidth / currentWidth;
var newFontSize = tDoc.fontSize * scaleFactor;
var maxFontSize = dDoc.fontSize * 0.65;
if (newFontSize > maxFontSize) { 
tDoc.fontSize = maxFontSize;
tProp.setValue(tDoc);
var newRect = tl.sourceRectAtTime(tl.inPoint, false);
var newWidth = newRect.width * (tScale[0] / 100);
var missingWidth = targetWidth - newWidth;
if (missingWidth > 0) { 
var numChars = Math.max(1, tDoc.text.length);
var trackingToAdd = (missingWidth * 1000) / (maxFontSize * numChars * (tScale[0] / 100));
tDoc.tracking = Math.round(trackingToAdd);
tProp.setValue(tDoc);
}
}
else {
tDoc.fontSize = newFontSize;
tProp.setValue(tDoc);
}
}}
}
}
var maxOutPoint = 0;
for (var m = 0; m < textLayers.length; m += 1) { 
if (textLayers[m].outPoint > maxOutPoint) { 
maxOutPoint = textLayers[m].outPoint;
}}
var hasApoio = (presetApoio) && (presetApoio !== "none");
var hasDestaque = (presetDestaque) && (presetDestaque !== "none");
var fileApoio = hasApoio ? new File(extPath + "/templates/" + templateFolder + "/" + presetApoio) : null;
var fileDestaque = hasDestaque ? new File(extPath + "/templates/" + templateFolder + "/" + presetDestaque) : null;
var originalTime = comp.time;
var baseLayer = textLayers[0];
var baseTime = baseLayer.inPoint;
var baseRect = baseLayer.sourceRectAtTime(baseTime, false);
var basePos = baseLayer.property("ADBE Transform Group").property("ADBE Position").value;
var baseAnchor = baseLayer.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var baseScale = baseLayer.property("ADBE Transform Group").property("ADBE Scale").value;
var baseVisualCenterY = basePos[1] + (((baseRect.top + (baseRect.height / 2)) - baseAnchor[1]) * (baseScale[1] / 100));
var baseVisualCenterX = basePos[0] + (((baseRect.left + (baseRect.width / 2)) - baseAnchor[0]) * (baseScale[0] / 100));
var totalHeight = 0;
var layerMetrics = [];
for (var i = 0; i < textLayers.length; i += 1) { 
var currLayer = textLayers[i];
var r = currLayer.sourceRectAtTime(currLayer.inPoint, false);
var a = currLayer.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var s = currLayer.property("ADBE Transform Group").property("ADBE Scale").value;
var realLayerHeight = r.height * (s[1] / 100);
totalHeight += realLayerHeight;
layerMetrics.push({anchor: a, layer: currLayer, realHeight: realLayerHeight, rect: r, scale: s});}
totalHeight += (spacing * (textLayers.length - 1));
var absoluteBlockTop = baseVisualCenterY - (totalHeight / 2);
var currentY = 0;
if (direction === "down") { 
currentY = absoluteBlockTop;
for (var j = 0; j < layerMetrics.length; j += 1) { 
var meta = layerMetrics[j];
var currentLayer = meta.layer;
currentLayer.property("ADBE Transform Group").property("ADBE Position").expression = "";
var posProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
var newY = currentY - ((meta.rect.top - meta.anchor[1]) * (meta.scale[1] / 100));
var newX = baseVisualCenterX - (((meta.rect.left + (meta.rect.width / 2)) - meta.anchor[0]) * (meta.scale[0] / 100));
posProp.setValue([newX, newY]);
currentY = currentY + meta.realHeight + spacing;}
}
else {
var absoluteBlockBottom = absoluteBlockTop + totalHeight;
currentY = absoluteBlockBottom;
for (var j = 0; j < layerMetrics.length; j += 1) { 
var meta = layerMetrics[j];
var currentLayer = meta.layer;
currentLayer.property("ADBE Transform Group").property("ADBE Position").expression = "";
var posProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
var newY = currentY - (((meta.rect.top + meta.rect.height) - meta.anchor[1]) * (meta.scale[1] / 100));
var newX = baseVisualCenterX - (((meta.rect.left + (meta.rect.width / 2)) - meta.anchor[0]) * (meta.scale[0] / 100));
posProp.setValue([newX, newY]);
currentY = (currentY - meta.realHeight) - spacing;}
}
for (var d = 1; d <= comp.numLayers; d += 1) { 
comp.layer(d).selected = false;}
for (var k = 0; k < textLayers.length; k += 1) { 
var tl = textLayers[k];
tl.outPoint = maxOutPoint;
var isDestaqueRow = k === (textLayers.length - 1);
var targetPresetFile = isDestaqueRow ? fileDestaque : fileApoio;
if ((targetPresetFile) && (targetPresetFile.exists)) { 
for (var d = 1; d <= comp.numLayers; d += 1) { 
comp.layer(d).selected = false;}
tl.selected = true;
comp.time = tl.inPoint;
tl.applyPreset(targetPresetFile);
tl.selected = false;
}}
if (importedAsset) { 
var assetLayer = comp.layers.add(importedAsset);
var destaqueLayer = textLayers[textLayers.length - 1];
if (dynamicStyle === "top") { 
destaqueLayer = textLayers[0];
}
assetLayer.moveAfter(destaqueLayer);
if (assetSync === "start") { 
assetLayer.startTime = textLayers[0].inPoint;
}
else {
assetLayer.startTime = destaqueLayer.inPoint;
}
var expPos = "";
if (assetPos === "center") { 
expPos = "var ctrlLayer = thisComp.layer(\'" + destaqueLayer.name + "\');\n" + "var r = ctrlLayer.sourceRectAtTime(time, false);\n" + "var s = ctrlLayer.transform.scale / 100;\n" + "var a = ctrlLayer.transform.anchorPoint;\n" + "var p = ctrlLayer.transform.position;\n" + "var centerX = p[0] + (r.left + r.width/2 - a[0]) * s[0];\n" + "var centerY = p[1] + (r.top + r.height/2 - a[1]) * s[1];\n" + "[centerX, centerY];";
}
else {
expPos = "var ctrlLayer = thisComp.layer(\'" + destaqueLayer.name + "\');\n" + "var r = ctrlLayer.sourceRectAtTime(time, false);\n" + "var s = ctrlLayer.transform.scale / 100;\n" + "var a = ctrlLayer.transform.anchorPoint;\n" + "var p = ctrlLayer.transform.position;\n" + "var centerX = p[0] + (r.left + r.width/2 - a[0]) * s[0];\n" + "var realHeight = r.height * s[1];\n" + "var dynamicGap = realHeight * 0.38;\n" + "var bottomY = p[1] + (r.top + r.height - a[1]) * s[1] + dynamicGap;\n" + "[centerX, bottomY];";
}
assetLayer.property("ADBE Transform Group").property("ADBE Position").expression = expPos;
assetLayer.outPoint = maxOutPoint;
}
comp.time = originalTime;
for (var k = 0; k < textLayers.length; k += 1) { 
textLayers[k].selected = true;}
var msg = "Anima\xe7\xe3o Aplicada: Sucesso!";
_deleteControlLayers(comp);
if (undoStarted) { 
app.endUndoGroup();
}
return msg;
} catch (e) {if (undoStarted) { 
app.endUndoGroup();
}
alert("Ocorreu um erro no Script:\n" + e.toString());
return "ERRO";
}
}
function getTemplateStructure(extPath) {
try {
var structure = [];
var pathsToScan = [{isUser: false, path: extPath + "/templates"}, {isUser: true, path: Folder.myDocuments.fsName + "/Frame Speed"}];
for (var p = 0; p < pathsToScan.length; p += 1) { 
var rootPath = pathsToScan[p].path.replace(/\\/g, "/");
var isUser = pathsToScan[p].isUser;
var rootFolder = new Folder(rootPath);
if (!rootFolder.exists) { 
continue ;
}
var categories = rootFolder.getFiles(function (f) {
return (f instanceof Folder) && (decodeURI(f.name).indexOf(".") !== 0);
});
categories.sort(function (a, b) {
return decodeURI(a.name) > decodeURI(b.name) ? 1 : -1;
});
for (var i = 0; i < categories.length; i += 1) { 
var catFolder = categories[i];
var catName = decodeURI(catFolder.name);
var categoryObj = null;
for (var si = 0; si < structure.length; si += 1) { 
if (structure[si].name === catName) { 
categoryObj = structure[si];
break ;
}}
if (!categoryObj) { 
categoryObj = {name: catName, subcategories: []};
structure.push(categoryObj);
}
var subCats = catFolder.getFiles(function (f) {
return (f instanceof Folder) && (decodeURI(f.name).indexOf(".") !== 0);
});
subCats.sort(function (a, b) {
var ORDER = ["SOLO", "DUO", "TRIO", "QUARTETO", "QUINTETO"];
var na = decodeURI(a.name).toUpperCase();
var nb = decodeURI(b.name).toUpperCase();
var ia = ORDER.indexOf(na);
var ib = ORDER.indexOf(nb);
if ((ia === -1) && (ib === -1)) { 
return na > nb ? 1 : -1;
}
if (ia === -1) { 
return 1;
}
if (ib === -1) { 
return -1;
}
return ia - ib;
});
for (var j = 0; j < subCats.length; j += 1) { 
var subFolder = subCats[j];
var subName = decodeURI(subFolder.name);
var subCatObj = null;
for (var sj = 0; sj < categoryObj.subcategories.length; sj += 1) { 
if (categoryObj.subcategories[sj].name === subName) { 
subCatObj = categoryObj.subcategories[sj];
break ;
}}
if (!subCatObj) { 
subCatObj = {name: subName, templates: []};
categoryObj.subcategories.push(subCatObj);
}
var tempFolders = subFolder.getFiles(function (f) {
return f instanceof Folder;
});
tempFolders.sort(function (a, b) {
return decodeURI(a.name) > decodeURI(b.name) ? 1 : -1;
});
var lineCount = 1;
var nameMapH = {duo: 2, quarteto: 4, quinteto: 5, solo: 1, trio: 3};
var subLower = subName.toLowerCase();
var lineCount = 1;
var foundInMap = false;
for (var nmKey in nameMapH) { 
if (subLower.indexOf(nmKey) !== -1) { 
lineCount = nameMapH[nmKey];
foundInMap = true;
break ;
}
}
if (!foundInMap) { 
var lineMatch = subName.match(/(\d+)\s*(linha|line)/i);
if ((lineMatch) && (lineMatch[1])) { 
lineCount = parseInt(lineMatch[1]);
}
}
for (var k = 0; k < tempFolders.length; k += 1) { 
try {
var tmpl = tempFolders[k];
var tmplName = decodeURI(tmpl.name);
var relativePath = catName + "/" + subName + "/" + tmplName;
var filesInTmpl = tmpl.getFiles();
var previewFile = "";
var aepFile = "";
var mogrtFile = "";
var ffxBase = "none";
var ffxDestaque = "none";
var assetFile = "";
for (var f = 0; f < filesInTmpl.length; f += 1) { 
var fileObj = filesInTmpl[f];
var fName = decodeURI(fileObj.name);
var ext = fName.indexOf(".") !== -1 ? fName.split(".").pop().toLowerCase() : "";
if ((ext === "mp4") || (ext === "gif")) { 
previewFile = isUser ? rootPath : "templates/" + relativePath + "/" + fName;
}
else if (((((((ext === "mov") || (ext === "mp3")) || (ext === "wav")) || (ext === "m4a")) || (ext === "aac")) || (ext === "aif")) || (ext === "aiff")) {
var isAudio = ext !== "mov";
if ((isAudio) || (assetFile === "")) { 
assetFile = fName;
}
if ((!previewFile) && (!isAudio)) { 
previewFile = isUser ? rootPath : "templates/" + relativePath + "/" + fName;
}
}
else if ((((ext === "aep") || (ext === "cga")) || (ext === "fsa")) || (ext === "aegraphic")) {
aepFile = fName;
}
else if (((ext === "mogrt") || (ext === "cgt")) || (ext === "fsm")) {
mogrtFile = fName;
}
else {
if (ext === "ffx") { 
if ((fName.toLowerCase().indexOf("apoio") !== -1) || (fName.toLowerCase().indexOf("base") !== -1)) { 
ffxBase = fName;
}
else {
ffxDestaque = fName;
}
}
}}
subCatObj.templates.push({aepFile: aepFile, assetFile: assetFile, ffxBase: ffxBase, ffxDestaque: ffxDestaque, folderPath: relativePath, isUser: isUser, lineCount: lineCount, mogrtFile: mogrtFile, name: tmplName, previewFile: previewFile});
} catch (etmpl) {
}}}}}
return _fsJSON.stringify(structure);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsAeFonteDeAudio() {
try {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) { 
return _fsJSON.stringify({error: "Abra (e selecione) uma composi\xe7\xe3o antes de transcrever."});
}
var melhor = null;
for (var i = 1; i <= comp.numLayers; i += 1) { 
var l = null;
try {
l = comp.layer(i);
} catch (eL) {continue ;
}
if (!l) { 
continue ;
}
var src = null;
try {
src = l.source;
} catch (eS) {src = null;
}
if ((!src) || (!(src instanceof FootageItem))) { 
continue ;
}
var temAudio = false;
try {
temAudio = !(!src.hasAudio);
} catch (eA) {
}
if (!temAudio) { 
continue ;
}
var arq = null;
try {
arq = src.file;
} catch (eF) {
}
if (!arq) { 
continue ;
}
var cand = {dur: 0, inPoint: 0, inicioNaComp: 0, nome: "", outPoint: 0, path: "", stretch: 100};
try {
cand.path = String(arq.fsName);
} catch (eP) {continue ;
}
try {
cand.nome = String((l.name) || (""));
} catch (eN) {
}
try {
cand.inicioNaComp = (Number(l.startTime)) || (0);
} catch (eI) {
}
try {
cand.inPoint = (Number(l.inPoint)) || (0);
} catch (eIp) {
}
try {
cand.outPoint = (Number(l.outPoint)) || (0);
} catch (eOp) {
}
try {
cand.stretch = (Number(l.stretch)) || (100);
} catch (eSt) {
}
cand.dur = cand.outPoint - cand.inPoint;
if ((!melhor) || (cand.dur > melhor.dur)) { 
melhor = cand;
}}
if (!melhor) { 
return _fsJSON.stringify({error: "N\xe3o achei nenhuma camada com \xe1udio e arquivo nesta composi\xe7\xe3o. Traga o v\xeddeo (com \xe1udio) pra comp e tente de novo."});
}
return _fsJSON.stringify({compDur: comp.duration, fonte: melhor, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function importSRTCaptions(jsonStr) {
try {
var args = _fsJSON.parse(jsonStr);
var captions = args.captions;
var textAlign = (args.textAlign) || ("center");
var screenPos = (args.screenPos) || ("bottom");
var stylesEnabled = args.stylesEnabled === true;
var highlightColor = (args.highlightColor) || ("");
var supportColor = (args.supportColor) || ("");
var fontFamily = ((args.fontHighlight) || (args.fontFamily)) || ("");
var fontSupport = (args.fontSupport) || ("");
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) { 
var msg = "Selecione uma composi\xe7\xe3o antes de importar o SRT.";
alert(msg);
return "Erro: " + msg;
}
app.beginUndoGroup("Legendador (SRT)");
if (textAlign === "left") { 
justification = ParagraphJustification.LEFT_JUSTIFY;
}
else if (textAlign === "right") {
justification = ParagraphJustification.RIGHT_JUSTIFY;
}
else {
justification = ParagraphJustification.CENTER_JUSTIFY;
}
if (screenPos === "top") { 
posY = comp.height * 0.15;
}
else if (screenPos === "center") {
posY = comp.height * 0.5;
}
else {
posY = comp.height * 0.85;
}
for (var i = 0; i < captions.length; i += 1) { 
var cap = captions[i];
var layer = comp.layers.addText(cap.text);
layer.inPoint = cap.startTime;
layer.outPoint = cap.endTime;
layer.comment = "LEGENDADOR";
layer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, posY]);
var prop = layer.property("Source Text");
var doc = prop.value;
doc.fontSize = 60;
doc.fillColor = [1, 1, 1];
doc.justification = justification;
prop.setValue(doc);
_applyCustomStylingToLayer(layer, stylesEnabled, highlightColor, supportColor, fontFamily, fontSupport, stylesEnabled);}
app.endUndoGroup();
return captions.length + " legendas importadas com sucesso!";
} catch (e) {try {
app.endUndoGroup();
} catch (eu) {
}
return "Erro: " + e.toString();
}
}
function clearImportedCaptions() {
try {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) { 
return "Erro: Nenhuma composi\xe7\xe3o ativa selecionada.";
}
app.beginUndoGroup("Limpar Legendas do SRT");
var count = 0;
for (var i = comp.numLayers; i >= 1; i--) { 
var layer = comp.layer(i);
if (layer.comment === "LEGENDADOR") { 
layer.remove();
count++;
}}
app.endUndoGroup();
if (count === 0) { 
return "Nenhuma legenda do SRT encontrada na composi\xe7\xe3o.";
}
return count + " legendas apagadas da tela com sucesso!";
} catch (err) {return "Erro ao limpar legendas: " + err.toString();
}
}
function importSRTFromFile(jsonStr) {
try {
var args = _fsJSON.parse(jsonStr);
var filePath = args.filePath;
var textAlign = (args.textAlign) || ("center");
var screenPos = (args.screenPos) || ("bottom");
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) { 
var msg = "Selecione uma composi\xe7\xe3o antes de importar o SRT.";
alert(msg);
return "Erro: " + msg;
}
var file = new File(filePath);
if (!file.exists) { 
return "Erro: Arquivo SRT n\xe3o encontrado.";
}
file.open("r");
var srt = file.read();
file.close();
var blocks = srt.split("\n\n");
app.beginUndoGroup("Legendador (SRT)");
if (textAlign === "left") { 
justification = ParagraphJustification.LEFT_JUSTIFY;
}
else if (textAlign === "right") {
justification = ParagraphJustification.RIGHT_JUSTIFY;
}
else {
justification = ParagraphJustification.CENTER_JUSTIFY;
}
if (screenPos === "top") { 
posY = comp.height * 0.15;
}
else if (screenPos === "center") {
posY = comp.height * 0.5;
}
else {
posY = comp.height * 0.85;
}
var count = 0;
for (var i = 0; i < blocks.length; i += 1) { 
var lines = blocks[i].split("\n");
if (lines.length < 3) { 
continue ;
}
var times = lines[1].split(" --> ");
if (times.length < 2) { 
continue ;
}
var text = "";
for (var li = 2; li < lines.length; li += 1) { 
text += lines[li] + " ";}
text = text.replace(/\s+$/, "");
var start = _srtTimeToSec(times[0]);
var end = _srtTimeToSec(times[1]);
var layer = comp.layers.addText(text);
layer.inPoint = start;
layer.outPoint = end;
layer.comment = "LEGENDADOR";
layer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, posY]);
var prop = layer.property("Source Text");
var doc = prop.value;
doc.fontSize = 60;
doc.fillColor = [1, 1, 1];
doc.justification = justification;
prop.setValue(doc);
count++;}
app.endUndoGroup();
return count + " legendas importadas com sucesso!";
} catch (e) {try {
app.endUndoGroup();
} catch (eu) {
}
return "Erro: " + e.toString();
}
}
function _srtTimeToSec(t) {
var p = t.replace(",", ".").split(":");
return (p[0] * 3600) + (p[1] * 60) + parseFloat(p[2]);
}
function clearCaptions() {
try {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) { 
return "Erro: Selecione uma composi\xe7\xe3o.";
}
app.beginUndoGroup("Limpar Legendas");
var count = 0;
for (var i = comp.numLayers; i >= 1; i--) { 
var l = comp.layer(i);
if (l.comment === "LEGENDADOR") { 
l.remove();
count++;
}}
app.endUndoGroup();
if (count === 0) { 
return "Nenhuma legenda encontrada para remover.";
}
return count + " legendas removidas!";
} catch (e) {try {
app.endUndoGroup();
} catch (eu) {
}
return "Erro: " + e.toString();
}
}
function getAESelectedLayers() {
try {
var proj = app.project;
if (!proj) { 
return _fsJSON.stringify({error: "Nenhum projeto aberto"});
}
var comp = proj.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
return _fsJSON.stringify({error: "Selecione uma composi\xe7\xe3o primeiro"});
}
var selected = comp.selectedLayers;
if ((!selected) || (selected.length === 0)) { 
return _fsJSON.stringify({error: "Selecione pelo menos 1 camada de texto na timeline"});
}
var textLayers = [];
for (var i = 0; i < selected.length; i += 1) { 
if (selected[i] instanceof TextLayer) { 
textLayers.push(selected[i]);
}}
if (textLayers.length === 0) { 
return _fsJSON.stringify({error: "Nenhuma camada de TEXTO selecionada"});
}
textLayers.sort(function (a, b) {
return a.inPoint - b.inPoint;
});
var texts = [];
var startTime = textLayers[0].inPoint;
var endTime = textLayers[0].outPoint;
var TPS = 254016000000;
for (var t = 0; t < textLayers.length; t += 1) { 
texts.push(textLayers[t].property("Source Text").value.text);
if (textLayers[t].outPoint > endTime) { 
endTime = textLayers[t].outPoint;
}}
$.framespeedLayerRefs = textLayers;
$.framespeedStartSec = startTime;
$.framespeedEndSec = endTime;
return _fsJSON.stringify({endTicks: String(Math.round(endTime * TPS)), hasSelection: true, startTicks: String(Math.round(startTime * TPS)), texts: texts});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function injectAegraphicAE(jsonStringArgs) {
try {
var args = _fsJSON.parse(jsonStringArgs);
var aepFileName = ((args.aepFile) || (args.aegraphicFile)) || ("");
var templateFolder = (args.templateFolder) || ("");
var extPath = (args.extPath) || ("");
var userTexts = (args.userTexts) || ([]);
var templateName = templateFolder ? templateFolder.split("/").pop() : "Template";
var highlightColor = (args.highlightColor) || ("");
var supportColor = (args.supportColor) || ("");
var fontHighlight = ((args.fontHighlight) || (args.fontFamily)) || ("");
var fontSupport = (args.fontSupport) || ("");
var fontHighlightFamily = (args.fontHighlightFamily) || ("");
var fontHighlightStyle = (args.fontHighlightStyle) || ("");
var fontSupportFamily = (args.fontSupportFamily) || ("");
var fontSupportStyle = (args.fontSupportStyle) || ("");
var stylesEnabled = args.stylesEnabled === true;
var fontsEnabled = args.fontsEnabled === true;
var TPS = 254016000000;
var startSec = 0;
var endSec = 3;
var proj = app.project;
if (!proj) { 
return "Erro: Nenhum projeto aberto.";
}
var comp = proj.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
return "Erro: Selecione uma composi\xe7\xe3o primeiro.";
}
var selNow = comp.selectedLayers;
var textLayerRefs = [];
for (var si = 0; si < selNow.length; si += 1) { 
if (selNow[si] instanceof TextLayer) { 
textLayerRefs.push(selNow[si]);
}}
textLayerRefs.sort(function (a, b) {
return a.inPoint - b.inPoint;
});
if (textLayerRefs.length === 0) { 
return "Erro: Selecione camadas de texto na timeline antes de clicar no template.";
}
var isReapply = textLayerRefs.length > 0;
for (var _rk = 0; _rk < textLayerRefs.length; _rk += 1) { 
try {
if (textLayerRefs[_rk].comment !== "FS_CONVERTED") { 
isReapply = false;
break ;
}
} catch (e) {isReapply = false;
break ;
}}
startSec = textLayerRefs[0].inPoint;
endSec = textLayerRefs[0].outPoint;
for (var ti = 1; ti < textLayerRefs.length; ti += 1) { 
if (textLayerRefs[ti].inPoint < startSec) { 
startSec = textLayerRefs[ti].inPoint;
}
if (textLayerRefs[ti].outPoint > endSec) { 
endSec = textLayerRefs[ti].outPoint;
}}
var origX = comp.width / 2;
var origY = comp.height * 0.75;
try {
var _uMinX = null;
var _uMaxX = null;
var _uMinY = null;
var _uMaxY = null;
for (var _bi = 0; _bi < textLayerRefs.length; _bi += 1) { 
var _bl = textLayerRefs[_bi];
var _bPos = _bl.property("ADBE Transform Group").property("ADBE Position").value;
var _bAnc = _bl.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var _bSca = _bl.property("ADBE Transform Group").property("ADBE Scale").value;
var _bRect = _bl.sourceRectAtTime(_bl.inPoint, false);
var _sx = _bSca[0] / 100;
var _sy = _bSca[1] / 100;
var _l = _bPos[0] + ((_bRect.left - _bAnc[0]) * _sx);
var _r = _bPos[0] + (((_bRect.left + _bRect.width) - _bAnc[0]) * _sx);
var _t = _bPos[1] + ((_bRect.top - _bAnc[1]) * _sy);
var _b = _bPos[1] + (((_bRect.top + _bRect.height) - _bAnc[1]) * _sy);
if ((_uMinX === null) || (_l < _uMinX)) { 
_uMinX = _l;
}
if ((_uMaxX === null) || (_r > _uMaxX)) { 
_uMaxX = _r;
}
if ((_uMinY === null) || (_t < _uMinY)) { 
_uMinY = _t;
}
if ((_uMaxY === null) || (_b > _uMaxY)) { 
_uMaxY = _b;
}}
if (_uMinX !== null) { 
origX = (_uMinX + _uMaxX) / 2;
origY = (_uMinY + _uMaxY) / 2;
}
} catch (ePos) {
}
if ((!userTexts) || (userTexts.length === 0)) { 
userTexts = [];
for (var ui = 0; ui < textLayerRefs.length; ui += 1) { 
try {
userTexts.push(textLayerRefs[ui].property("Source Text").value.text);
} catch (eut) {userTexts.push("");
}}
}
var origTextHeight = 0;
try {
var oRect = textLayerRefs[0].sourceRectAtTime(textLayerRefs[0].inPoint, false);
var oSca = textLayerRefs[0].property("ADBE Transform Group").property("ADBE Scale").value;
origTextHeight = oRect.height * (oSca[1] / 100);
} catch (eOH) {
}
var maxOutPoint = endSec;
var insertAtIndex = comp.numLayers;
for (var ri = 0; ri < textLayerRefs.length; ri += 1) { 
try {
if (textLayerRefs[ri].index < insertAtIndex) { 
insertAtIndex = textLayerRefs[ri].index;
}
} catch (e) {
}}
var _maxSelIdx = 0;
for (var ri = 0; ri < textLayerRefs.length; ri += 1) { 
try {
if (textLayerRefs[ri].index > _maxSelIdx) { 
_maxSelIdx = textLayerRefs[ri].index;
}
} catch (e) {
}}
var anchorBelowLayer = null;
try {
if ((_maxSelIdx >= 1) && ((_maxSelIdx + 1) <= comp.numLayers)) { 
anchorBelowLayer = comp.layer(_maxSelIdx + 1);
}
} catch (e) {
}
var origTimings = [];
for (var ri = 0; ri < textLayerRefs.length; ri += 1) { 
origTimings.push({inPoint: textLayerRefs[ri].inPoint, outPoint: textLayerRefs[ri].outPoint});}
for (var ri = textLayerRefs.length - 1; ri >= 0; ri--) { 
try {
textLayerRefs[ri].remove();
} catch (eRm) {
}}
if (insertAtIndex > comp.numLayers) { 
insertAtIndex = comp.numLayers;
}
var fullPath = aepFileName;
if (((fullPath.indexOf("/") !== 0) && (fullPath.indexOf(":\\") === -1)) && (fullPath.indexOf(":/") === -1)) { 
fullPath = extPath + "/templates/" + templateFolder + "/" + aepFileName;
}
fullPath = fullPath.replace(/\\/g, "/");
var aepFileObj = new File(fullPath);
if (!aepFileObj.exists) { 
var dir = new Folder(extPath + "/templates/" + templateFolder);
if ((dir) && (dir.exists)) { 
var aepFiles = dir.getFiles("*.aep");
if ((aepFiles) && (aepFiles.length > 0)) { 
aepFileObj = aepFiles[0];
fullPath = aepFileObj.fsName;
}
}
}
if (!aepFileObj.exists) { 
return "Erro: Template AEP n\xe3o encontrado em: " + fullPath;
}
var importOpts = new ImportOptions(aepFileObj);
var importedFolder = proj.importFile(importOpts);
if (!importedFolder) { 
return "Erro: Falha ao importar o template AEP.";
}
var masterComp = null;
for (var i = 1; i <= importedFolder.numItems; i += 1) { 
var item = importedFolder.item(i);
if (item instanceof CompItem) { 
masterComp = item;
break ;
}}
if (!masterComp) { 
return "Erro: Nenhuma composi\xe7\xe3o encontrada no template AEP.";
}
var tCount = 0;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
if ((masterComp.layer(m) instanceof TextLayer) && (masterComp.layer(m).name.toUpperCase().indexOf("TEXTO ") === 0)) { 
tCount++;
}}
var isSingle = tCount === 1;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
var tLayer = masterComp.layer(m);
if (!(tLayer instanceof TextLayer)) { 
continue ;
}
var lName = tLayer.name.toUpperCase();
if (((isSingle) && (lName === "TEXTO 1")) && (userTexts.length > 0)) { 
var prop = tLayer.property("Source Text");
var doc = prop.value;
doc.text = userTexts.join(" ");
prop.setValue(doc);
}
else {
for (var r = 0; r < userTexts.length; r += 1) { 
if (lName === ("TEXTO " + r + 1)) { 
var prop = tLayer.property("Source Text");
var doc = prop.value;
doc.text = userTexts[r];
prop.setValue(doc);
break ;
}}
}}
var tmplTextHeight = 0;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
var ml = masterComp.layer(m);
if ((ml instanceof TextLayer) && (ml.name.toUpperCase() === "TEXTO 1")) { 
try {
var mlRect = ml.sourceRectAtTime(0, false);
var mlSca = ml.property("ADBE Transform Group").property("ADBE Scale").value;
tmplTextHeight = mlRect.height * (mlSca[1] / 100);
} catch (eMH) {
}
break ;
}}
var scaleRatio = (tmplTextHeight > 0) && (origTextHeight > 0) ? origTextHeight / tmplTextHeight : 1;
if (scaleRatio > 1) { 
scaleRatio = 1;
}
if (scaleRatio < 0.05) { 
scaleRatio = 0.05;
}
var tmplX = masterComp.width / 2;
var tmplY = masterComp.height / 2;
for (var m = 1; m <= masterComp.numLayers; m += 1) { 
var li2 = masterComp.layer(m);
if ((li2 instanceof TextLayer) && (li2.name.toUpperCase() === "TEXTO 1")) { 
try {
var tPos = li2.property("ADBE Transform Group").property("ADBE Position").value;
var tAnc = li2.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var tSca = li2.property("ADBE Transform Group").property("ADBE Scale").value;
var tRect = li2.sourceRectAtTime(0, false);
tmplX = tPos[0] + (((tRect.left + (tRect.width / 2)) - tAnc[0]) * (tSca[0] / 100));
tmplY = tPos[1] + (((tRect.top + (tRect.height / 2)) - tAnc[1]) * (tSca[1] / 100));
} catch (eTPos) {
}
break ;
}}
var _isBounceTpl = ("" + templateFolder).toLowerCase().indexOf("bounce") !== -1;
var extractedLayers = {};
var uniqueSuffix = " #" + Math.round(Math.random() * 8999) + 1000;
var textLayerExtractCount = 0;
for (var j = 1; j <= masterComp.numLayers; j += 1) { 
var layerInside = masterComp.layer(j);
var _isCtrlLayer = (_isBounceTpl) && ((layerInside.name) || ("").toLowerCase().indexOf("controlador") !== -1);
if ((!(layerInside instanceof TextLayer)) && (!_isCtrlLayer)) { 
continue ;
}
var oldName = layerInside.name;
var wasLocked = layerInside.locked;
if (wasLocked) { 
layerInside.locked = false;
}
var origParent = layerInside.parent;
if (origParent) { 
layerInside.parent = null;
}
layerInside.copyToComp(comp);
var newLayer = comp.layer(1);
if (origParent) { 
layerInside.parent = origParent;
}
if (wasLocked) { 
layerInside.locked = true;
}
var tNumMatch = oldName.match(/(\d+)\s*$/);
var tIdx = tNumMatch ? parseInt(tNumMatch[1], 10) - 1 : textLayerExtractCount;
var tplNum = tNumMatch ? parseInt(tNumMatch[1], 10) : textLayerExtractCount + 1;
var _tplFontSize = 0;
try {
_tplFontSize = layerInside.property("Source Text").value.fontSize;
} catch (eFS) {
}
var _capName = _isCtrlLayer ? oldName : ((layerInside instanceof TextLayer) && (userTexts[tIdx] !== undefined)) && (userTexts[tIdx] !== "") ? userTexts[tIdx] : oldName + uniqueSuffix;
try {
newLayer.name = _capName;
} catch (e) {
}
try {
newLayer.comment = "FS_CONVERTED";
} catch (e) {
}
extractedLayers[j] = {fontSize: _tplFontSize, isText: layerInside instanceof TextLayer, newL: newLayer, orig: layerInside, tplNum: tplNum};
var tRef = null;
if (layerInside instanceof TextLayer) { 
tRef = (origTimings[tIdx]) || (origTimings[0]);
textLayerExtractCount++;
}
else {
tRef = origTimings[0];
}
var tIn = tRef ? tRef.inPoint : startSec;
var tOut = maxOutPoint;
try {
newLayer.startTime = tIn;
} catch (e) {
}
try {
newLayer.inPoint = tIn;
} catch (e) {
}
try {
newLayer.outPoint = tOut;
} catch (e) {
}}
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if (!extractedLayers[k]) { 
continue ;
}
var origL = extractedLayers[k].orig;
var newL = extractedLayers[k].newL;
if (origL.parent) { 
var pIdx = origL.parent.index;
if (extractedLayers[pIdx]) { 
try {
newL.parent = extractedLayers[pIdx].newL;
} catch (e) {
}
}
}}
var _maxTplFs = 0;
for (var _kf in extractedLayers) { 
if (((extractedLayers.hasOwnProperty(_kf)) && (extractedLayers[_kf].isText)) && (extractedLayers[_kf].fontSize > _maxTplFs)) { 
_maxTplFs = extractedLayers[_kf].fontSize;
}
}
for (var _kh in extractedLayers) { 
if ((extractedLayers.hasOwnProperty(_kh)) && (extractedLayers[_kh].isText)) { 
extractedLayers[_kh].isHighlight = _maxTplFs > 0 ? extractedLayers[_kh].fontSize >= (_maxTplFs - 0.5) : true;
}
}
var alignmentNull = comp.layers.addNull();
alignmentNull.name = "CONTROLE: " + templateName;
alignmentNull.label = 13;
alignmentNull.startTime = startSec;
try {
alignmentNull.inPoint = startSec;
} catch (e) {
}
try {
alignmentNull.outPoint = maxOutPoint;
} catch (e) {
}
var _nx = origX;
var _ny = origY;
try {
var _miX = null;
var _maX = null;
var _miY = null;
var _maY = null;
for (var _ck = 1; _ck <= masterComp.numLayers; _ck += 1) { 
if ((!extractedLayers[_ck]) || (!extractedLayers[_ck].isText)) { 
continue ;
}
var _cl = extractedLayers[_ck].newL;
if (!_cl) { 
continue ;
}
var _cP = _cl.property("ADBE Transform Group").property("ADBE Position").value;
var _cA = _cl.property("ADBE Transform Group").property("ADBE Anchor Point").value;
var _cS = _cl.property("ADBE Transform Group").property("ADBE Scale").value;
var _cR = _cl.sourceRectAtTime(_cl.inPoint, false);
var _ssx = _cS[0] / 100;
var _ssy = _cS[1] / 100;
var _L = _cP[0] + ((_cR.left - _cA[0]) * _ssx);
var _R = _cP[0] + (((_cR.left + _cR.width) - _cA[0]) * _ssx);
var _T = _cP[1] + ((_cR.top - _cA[1]) * _ssy);
var _B = _cP[1] + (((_cR.top + _cR.height) - _cA[1]) * _ssy);
if ((_miX === null) || (_L < _miX)) { 
_miX = _L;
}
if ((_maX === null) || (_R > _maX)) { 
_maX = _R;
}
if ((_miY === null) || (_T < _miY)) { 
_miY = _T;
}
if ((_maY === null) || (_B > _maY)) { 
_maY = _B;
}}
if (_miX !== null) { 
_nx = (_miX + _maX) / 2;
_ny = (_miY + _maY) / 2;
}
} catch (_ecn) {
}
alignmentNull.property("ADBE Transform Group").property("ADBE Position").setValue([_nx, _ny]);
alignmentNull.property("ADBE Transform Group").property("ADBE Scale").setValue([scaleRatio * 100, scaleRatio * 100]);
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if (!extractedLayers[k]) { 
continue ;
}
var newL = extractedLayers[k].newL;
if ((newL) && (newL.parent === null)) { 
try {
newL.parent = alignmentNull;
} catch (e) {
}
}}
var _nullPosX = origX;
if (isReapply) { 
_nullPosY = origY;
}
else if (comp.width > comp.height) {
_nullPosY = comp.height * 0.72;
}
else {
_nullPosY = origY - (comp.height * 0.164);
}
try {
alignmentNull.property("ADBE Transform Group").property("ADBE Position").setValue([_nullPosX, _nullPosY]);
} catch (eMove) {
}
var _ordItems = [];
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if ((extractedLayers[k]) && (extractedLayers[k].isText)) { 
_ordItems.push(extractedLayers[k]);
}}
_ordItems.sort(function (a, b) {
return a.tplNum - b.tplNum;
});
var textLayersOrdered = [];
for (var _oi = 0; _oi < _ordItems.length; _oi += 1) { 
textLayersOrdered.push(_ordItems[_oi].newL);}
var anchorLayer = anchorBelowLayer;
if (textLayersOrdered.length >= 1) { 
try {
if (anchorLayer) { 
textLayersOrdered[0].moveBefore(anchorLayer);
}
else {
textLayersOrdered[0].moveToEnd();
}
} catch (e) {
}
}
for (var lp = 1; lp < textLayersOrdered.length; lp += 1) { 
try {
textLayersOrdered[lp].moveBefore(textLayersOrdered[lp - 1]);
} catch (e) {
}}
try {
var topText = textLayersOrdered[textLayersOrdered.length - 1];
if (topText) { 
alignmentNull.moveBefore(topText);
}
else {
if (anchorLayer) { 
alignmentNull.moveBefore(anchorLayer);
}
}
} catch (e) {
}
alignmentNull.selected = true;
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if ((!extractedLayers[k]) || (!extractedLayers[k].isText)) { 
continue ;
}
var nl = extractedLayers[k].newL;
try {
if (!nl.enabled) { 
nl.remove();
}
} catch (e) {
}}
try {
for (var li3 = comp.numLayers; li3 >= 1; li3--) { 
try {
if (comp.layer(li3).source === masterComp) { 
comp.layer(li3).remove();
break ;
}
} catch (eFR) {
}}
} catch (eFin) {
}
for (var k = 1; k <= masterComp.numLayers; k += 1) { 
if (!extractedLayers[k]) { 
continue ;
}
var _fHl = extractedLayers[k].isText ? extractedLayers[k].isHighlight : undefined;
_applyCustomStylingToLayer(extractedLayers[k].newL, stylesEnabled, highlightColor, supportColor, fontHighlight, fontSupport, fontsEnabled, fontHighlightFamily, fontHighlightStyle, fontSupportFamily, fontSupportStyle, _fHl);}
try {
if (((typeof tempAepFile !== "undefined") && (tempAepFile)) && (tempAepFile.fsName !== aepFileObj.fsName)) { 
tempAepFile.remove();
}
} catch (eTmp) {
}
return "Template AEP aplicado com sucesso!";
} catch (e) {return "Erro: " + e.toString();
}
}
function _fsGetBlockText(props) {
if (!props) { 
return "";
}
for (var a = 0; a < props.numItems; a += 1) { 
var pa = props[a];
if (!pa) { 
continue ;
}
var kids = false;
try {
kids = pa.numItems > 0;
} catch (e0) {
}
if (kids) { 
var sub = _fsGetBlockText(pa);
if (sub) { 
return sub;
}
continue ;
}
try {
var v = pa.getValue();
if ((typeof v === "string") && (v.indexOf("textEditValue") !== -1)) { 
var o = _fsJSON.parse(v);
if (((o) && (o.textEditValue !== undefined)) && (o.textEditValue !== null)) { 
return String(o.textEditValue);
}
}
} catch (e1) {
}}
return "";
}
function fsLegendasExportarProjeto(caminho) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
if (typeof seq.exportAsProject !== "function") { 
return _fsJSON.stringify({error: "Este Premiere n\xe3o exp\xf5e exportAsProject; n\xe3o consigo ler as legendas da timeline nesta vers\xe3o."});
}
var f = new File(String((caminho) || ("")).split("\\").join("/"));
try {
if (f.exists) { 
f.remove();
}
} catch (eRm) {
}
var r = null;
try {
r = seq.exportAsProject(f.fsName);
} catch (eX) {return _fsJSON.stringify({error: "exportAsProject recusou: " + eX});
}
var existe = false;
try {
existe = f.exists;
} catch (eE) {existe = false;
}
if (!existe) { 
return _fsJSON.stringify({error: "exportAsProject devolveu " + r + " mas o arquivo n\xe3o apareceu."});
}
var tam = 0;
try {
tam = f.length;
} catch (eL) {tam = 0;
}
return _fsJSON.stringify({caminho: f.fsName, ok: true, retorno: String(r), tamanho: tam});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsLegendasDaTimeline(indiceTrilha) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var trilhas = [];
try {
if ((seq.captionTracks) && (seq.captionTracks.numTracks)) { 
for (var i = 0; i < seq.captionTracks.numTracks; i += 1) { 
var tt = null;
try {
tt = seq.captionTracks[i];
} catch (eT) {tt = null;
}
if (tt) { 
trilhas.push(tt);
}}
}
} catch (e1) {
}
if (!trilhas.length) { 
try {
if (seq.captionTrack) { 
trilhas.push(seq.captionTrack);
}
} catch (e2) {
}
}
if (!trilhas.length) { 
return _fsJSON.stringify({codigo: "SEM_TRILHA", error: "N\xe3o achei trilha de legendas nesta sequ\xeancia. Se as legendas do Premiere est\xe3o a\xed, abra Janela > Legendas e confira se a trilha existe."});
}
var quais = [];
for (var q = 0; q < trilhas.length; q += 1) { 
var n = 0;
try {
n = trilhas[q].clips.numItems;
} catch (eN) {n = 0;
}
quais.push({idx: q, itens: n});}
var alvo = -1;
if (((typeof indiceTrilha === "number") && (indiceTrilha >= 0)) && (indiceTrilha < trilhas.length)) { 
alvo = indiceTrilha;
}
else {
var melhor = -1;
for (var w = 0; w < quais.length; w += 1) { 
if (quais[w].itens > melhor) { 
melhor = quais[w].itens;
alvo = quais[w].idx;
}}
}
if (alvo < 0) { 
return _fsJSON.stringify({error: "Trilha de legendas inv\xe1lida."});
}
var itens = trilhas[alvo].clips;
var total = 0;
try {
total = itens.numItems;
} catch (eI) {total = 0;
}
if (!total) { 
return _fsJSON.stringify({error: "A trilha de legendas est\xe1 vazia (nenhuma legenda na timeline)."});
}
var caps = [];
var semTexto = 0;
for (var c = 0; c < total; c += 1) { 
var cl = null;
try {
cl = itens[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var ini = 0;
var fim = 0;
try {
ini = parseFloat(cl.start.seconds);
fim = parseFloat(cl.end.seconds);
} catch (eS) {continue ;
}
if (((isNaN(ini)) || (isNaN(fim))) || (!(fim > ini))) { 
continue ;
}
var txt = "";
try {
txt = cl.caption.getText();
} catch (eX) {txt = "";
}
if (!txt) { 
try {
txt = String((cl.name) || (""));
} catch (eNm) {txt = "";
}
}
txt = String(txt).replace(/<[^>]+>/g, " ").replace(/[\r\n]+/g, " ");
txt = txt.replace(/\s+/g, " ");
txt = txt.replace(/^\s+|\s+$/g, "");
if (txt === "") { 
semTexto++;
continue ;
}
caps.push({endTime: fim, startTime: ini, text: txt});}
if (!caps.length) { 
return _fsJSON.stringify({error: "Achei " + total + " legenda(s) na trilha, mas n\xe3o consegui ler o texto de nenhuma. " + "Verifique se s\xe3o legendas de texto (n\xe3o imagem)."});
}
caps.sort(function (a, b) {
return a.startTime - b.startTime;
});
return _fsJSON.stringify({achadas: total, caps: caps, ok: true, semTexto: semTexto, trilhaUsada: alvo, trilhas: trilhas.length});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function getPremiereCaptionsForSelection() {
try {
var proj = app.project;
if (!proj) { 
return _fsJSON.stringify({debug: "no project", texts: []});
}
var seq = proj.activeSequence;
if (!seq) { 
return _fsJSON.stringify({debug: "no sequence", texts: []});
}
var texts = [];
var debugMsg = "";
var minStartTicks = "";
var maxEndTicks = "";
var minStartSec = 999999999;
var maxEndSec = -1;
var hasSelection = false;
var isFromCaption = false;
var clipTimings = [];
var captionTrack = null;
try {
captionTrack = seq.captionTrack;
} catch (ec) {debugMsg += "ctErr=" + ec + ";";
}
if (captionTrack) { 
var items = captionTrack.clips;
debugMsg += "ct=" + items.numItems + ";";
for (var ci = 0; ci < items.numItems; ci += 1) { 
var cpClip = items[ci];
var sel = false;
try {
sel = cpClip.isSelected();
} catch (es) {
}
if (sel) { 
hasSelection = true;
isFromCaption = true;
clipTimings.push({endTicks: cpClip.end.ticks, startTicks: cpClip.start.ticks});
if (cpClip.start.seconds < minStartSec) { 
minStartSec = cpClip.start.seconds;
minStartTicks = cpClip.start.ticks;
}
if (cpClip.end.seconds > maxEndSec) { 
maxEndSec = cpClip.end.seconds;
maxEndTicks = cpClip.end.ticks;
}
var txt = "";
try {
txt = cpClip.caption.getText();
} catch (e1) {
}
if (txt) { 
txt = txt.replace(/<[^>]+>/g, "").replace(/\n/g, " ").trim();
texts.push(txt);
}
}}
}
var targetTrackIndex = -1;
var vidTexts = [];
var videoTracks = seq.videoTracks;
if (!hasSelection) { 
debugMsg += "vt=" + videoTracks.numTracks + ";";
for (var i = 0; i < videoTracks.numTracks; i += 1) { 
var track = videoTracks[i];
var clips = track.clips;
for (var j = 0; j < clips.numItems; j += 1) { 
var clip = clips[j];
var isSelV = false;
try {
isSelV = clip.isSelected();
} catch (esv) {
}
if (isSelV) { 
hasSelection = true;
if (targetTrackIndex === -1) { 
targetTrackIndex = i;
}
try {
var mgtSel = clip.getMGTComponent();
if (mgtSel) { 
var mgtTxt = _fsGetBlockText(mgtSel.properties);
if (mgtTxt) { 
vidTexts.push({s: parseFloat(clip.start.ticks), t: mgtTxt.replace(/\n/g, " ").replace(/\s+/g, " ")});
}
}
} catch (eMgSel) {
}
clipTimings.push({endTicks: clip.end.ticks, startTicks: clip.start.ticks});
if (clip.start.seconds < minStartSec) { 
minStartSec = clip.start.seconds;
minStartTicks = clip.start.ticks;
}
if (clip.end.seconds > maxEndSec) { 
maxEndSec = clip.end.seconds;
maxEndTicks = clip.end.ticks;
}
}}}
}
else {
targetTrackIndex = videoTracks.numTracks > 0 ? videoTracks.numTracks - 1 : 0;
}
if (!hasSelection) { 
debugMsg += "no_sel_using_cti;";
minStartTicks = seq.getPlayerPosition().ticks;
minStartSec = parseFloat(minStartTicks) / 254016000000;
maxEndSec = minStartSec + 3;
maxEndTicks = String(parseInt(minStartTicks) + 762048000000);
}
else {
debugMsg += "sel_ok(" + isFromCaption ? "caption" : "video" + ") start=" + minStartSec.toFixed(1) + " end=" + maxEndSec.toFixed(1) + ";";
}
clipTimings.sort(function (a, b) {
return parseFloat(a.startTicks) - parseFloat(b.startTicks);
});
if ((texts.length === 0) && (vidTexts.length > 0)) { 
vidTexts.sort(function (a, b) {
return a.s - b.s;
});
for (var vtx = 0; vtx < vidTexts.length; vtx += 1) { 
texts.push(vidTexts[vtx].t);}
debugMsg += "mgt_texts=" + vidTexts.length + ";";
}
return _fsJSON.stringify({clipTimings: clipTimings, debug: debugMsg, endTicks: maxEndTicks, hasSelection: hasSelection, isFromCaption: isFromCaption, startTicks: minStartTicks, texts: texts, trackIndex: targetTrackIndex});
} catch (e) {return _fsJSON.stringify({debug: "FATAL:" + e.toString(), texts: []});
}
}
function getPremiereCTI() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var pos = seq.getPlayerPosition();
return _fsJSON.stringify({ticks: pos.ticks});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function dumpMgtStructure() {
try {
function walk(props, depth) {
var pad = "";
for (var d = 0; d < depth; d += 1) { 
pad += "  ";}
for (var i = 0; i < props.numItems; i += 1) { 
var p = props[i];
var name = "";
try {
name = (p.displayName) || ("(item " + i + ")");
} catch (e) {name = "(err)";
}
var numIt = 0;
try {
numIt = (p.numItems) || (0);
} catch (e) {numIt = -1;
}
if (numIt > 0) { 
lines.push(pad + "[GROUP] " + name + " (numItems=" + numIt + ")");
walk(p, depth + 1);
}
else {
var val = "";
var fullVal = "";
try {
var v = p.getValue();
fullVal = typeof v === "string" ? v : _fsJSON.stringify(v);
var isFontSrc = (typeof v === "string") && (v.indexOf("fontEditValue") !== -1);
var isTextSrc = (typeof v === "string") && (v.indexOf("textEditValue") !== -1);
var isFontStnd = ((name.toLowerCase().indexOf("font") !== -1) || (name.toLowerCase().indexOf("fonte") !== -1)) || (name.toLowerCase().indexOf("family") !== -1);
var tag = "";
if (isFontSrc) { 
tag += "[FONT-JSON]";
}
if (isTextSrc) { 
tag += "[TEXT-JSON]";
}
if (isFontStnd) { 
tag += "[FONT-NAME]";
}
if (fullVal.length > 500) { 
val = fullVal.substring(0, 500) + "...(+" + (fullVal.length - 500) + ")";
}
else {
val = fullVal;
}
} catch (e) {val = "(no getValue: " + e + ")";
}
var hasColor = typeof p.setColorValue === "function";
lines.push(pad + hasColor ? "[COLOR] " : "[LEAF]  " + name + " " + (tag) || ("") + " = " + val);
}}
}
var seq = app.project.activeSequence;
if (!seq) { 
return "Sem sequencia ativa";
}
var clip = null;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = seq.videoTracks[t];
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
if (tr.clips[c].isSelected()) { 
clip = tr.clips[c];
break ;
}
} catch (e) {
}}
if (clip) { 
break ;
}}
if (!clip) { 
return "Selecione um clip MOGRT na timeline primeiro";
}
var mgt = clip.getMGTComponent();
if (!mgt) { 
return "Clip selecionado nao e um MOGRT";
}
var lines = [];
lines.push("=== DUMP MGT: " + clip.name + " ===");
lines.push("numItems total: " + mgt.properties.numItems);
lines.push("");
walk(mgt.properties, 0);
return lines.join("\n");
} catch (e) {return "Erro: " + e.toString();
}
}
function addVideoTrackAndRetry() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return "NO_SEQ";
}
var before = seq.videoTracks.numTracks;
if (_fsAddTrilhaVideo(seq)) { 
return "OK";
}
if (seq.videoTracks.numTracks > before) { 
return "OK";
}
return "FAIL";
} catch (e) {return "FAIL";
}
}
function exportTimelineAudio(presetPath, workAreaType) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var presetFile = new File(presetPath);
if (!presetFile.exists) { 
return _fsJSON.stringify({error: "Preset de \xe1udio n\xe3o encontrado em: " + presetPath});
}
var wat = typeof workAreaType === "number" ? workAreaType : 0;
var tmpName = "fs_transcribe_" + new Date().getTime() + ".mp3";
var outFileObj = new File(Folder.temp.fsName + "/" + tmpName);
var outNative = outFileObj.fsName;
try {
seq.exportAsMediaDirect(outNative, presetFile.fsName, wat);
} catch (eExp) {return _fsJSON.stringify({error: "Falha na exporta\xe7\xe3o: " + eExp.toString()});
}
var check = new File(outNative);
if ((!check.exists) || (check.length <= 0)) { 
return _fsJSON.stringify({error: "\xc1udio n\xe3o foi gerado (verifique se a sequ\xeancia tem \xe1udio)."});
}
return _fsJSON.stringify({ok: true, path: check.fsName});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsSeqFps() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({ok: false});
}
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
return _fsJSON.stringify({ok: false});
}
return _fsJSON.stringify({fps: 254016000000 / tpf, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString(), ok: false});
}
}
function fsTrilhasAudio() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Abra uma sequ\xeancia."});
}
var lista = [];
var n = 0;
try {
n = seq.audioTracks.numTracks;
} catch (eN) {n = 0;
}
for (var i = 0; i < n; i += 1) { 
var tr = null;
try {
tr = seq.audioTracks[i];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var clipes = 0;
try {
clipes = tr.clips.numItems;
} catch (eC) {clipes = 0;
}
var nome = "A" + i + 1;
try {
if (tr.name) { 
nome = String(tr.name);
}
} catch (eNm) {
}
var mudo = false;
try {
mudo = !(!tr.isMuted());
} catch (eM) {
}
lista.push({clipes: clipes, i: i, mudo: mudo, nome: nome});}
return _fsJSON.stringify({ok: true, trilhas: lista});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsExportAudioTrecho(presetPath, trilhaIdx, iniSeg, fimSeg) {
var seq = null;
var estados = [];
var mexeuMudo = false;
var inAntes = null;
var outAntes = null;
var mexeuMarca = false;
try {
seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var presetFile = new File(presetPath);
if (!presetFile.exists) { 
return _fsJSON.stringify({error: "Preset de \xe1udio n\xe3o encontrado em: " + presetPath});
}
var ini = parseFloat(iniSeg);
var fim = parseFloat(fimSeg);
if (((isNaN(ini)) || (isNaN(fim))) || (!(fim > ini))) { 
return _fsJSON.stringify({error: "Trecho inv\xe1lido."});
}
try {
inAntes = seq.getInPointAsTime();
} catch (eI1) {inAntes = null;
}
try {
outAntes = seq.getOutPointAsTime();
} catch (eO1) {outAntes = null;
}
var idx = parseInt(trilhaIdx, 10);
if (isNaN(idx)) { 
idx = -1;
}
if (idx >= 0) { 
var n = 0;
try {
n = seq.audioTracks.numTracks;
} catch (eN) {n = 0;
}
if (idx >= n) { 
return _fsJSON.stringify({error: "A trilha escolhida n\xe3o existe."});
}
for (var t = 0; t < n; t += 1) { 
var tr = null;
try {
tr = seq.audioTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var antes = false;
try {
antes = !(!tr.isMuted());
} catch (eIs) {
}
estados.push({mudo: antes, t: t});
var quer = t !== idx;
if (quer !== antes) { 
try {
tr.setMute(quer ? 1 : 0);
mexeuMudo = true;
} catch (eS) {
}
}}
}
try {
seq.setInPoint(ini);
seq.setOutPoint(fim);
mexeuMarca = true;
} catch (eM) {return _fsJSON.stringify({error: "N\xe3o consegui marcar o trecho: " + eM.toString()});
}
var tmpName = "fs_tr_" + new Date().getTime() + "_" + Math.round(ini) + ".mp3";
var outFileObj = new File(Folder.temp.fsName + "/" + tmpName);
var outNative = outFileObj.fsName;
try {
seq.exportAsMediaDirect(outNative, presetFile.fsName, 1);
} catch (eExp) {return _fsJSON.stringify({error: "Falha na exporta\xe7\xe3o: " + eExp.toString()});
}
var check = new File(outNative);
if ((!check.exists) || (check.length <= 0)) { 
return _fsJSON.stringify({error: "Trecho n\xe3o gerou \xe1udio."});
}
return _fsJSON.stringify({bytes: check.length, fim: fim, ini: ini, ok: true, path: check.fsName});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
} finally {
if (seq) { 
if (mexeuMarca) { 
try {
if (inAntes !== null) { 
seq.setInPoint(inAntes.seconds);
}
} catch (eR1) {
}
try {
if (outAntes !== null) { 
seq.setOutPoint(outAntes.seconds);
}
} catch (eR2) {
}
}
if (mexeuMudo) { 
for (var r = 0; r < estados.length; r += 1) { 
try {
seq.audioTracks[estados[r].t].setMute(estados[r].mudo ? 1 : 0);
} catch (eR3) {
}}
}
}
}
}
function fsDuracaoSequencia() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var d = 0;
try {
d = parseFloat(seq.end) / 254016000000;
} catch (eD) {
}
if (!(d > 0)) { 
try {
d = parseFloat(seq.getOutPointAsTime().seconds);
} catch (eD2) {
}
}
if (!(d > 0)) { 
return _fsJSON.stringify({error: "N\xe3o consegui medir a dura\xe7\xe3o da sequ\xeancia."});
}
return _fsJSON.stringify({dur: d, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsExportAudioTrilha(presetPath, workAreaType, trilhaIdx) {
var seq = null;
var estados = [];
var mexeu = false;
var inAntes = null;
var outAntes = null;
var mexeuMarca = false;
try {
seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var presetFile = new File(presetPath);
if (!presetFile.exists) { 
return _fsJSON.stringify({error: "Preset de \xe1udio n\xe3o encontrado em: " + presetPath});
}
var idx = parseInt(trilhaIdx, 10);
if (isNaN(idx)) { 
idx = -1;
}
if (idx >= 0) { 
var n = 0;
try {
n = seq.audioTracks.numTracks;
} catch (eN) {n = 0;
}
if (idx >= n) { 
return _fsJSON.stringify({error: "A trilha escolhida n\xe3o existe nesta sequ\xeancia."});
}
var temClipe = false;
try {
temClipe = seq.audioTracks[idx].clips.numItems > 0;
} catch (eTc) {
}
if (!temClipe) { 
return _fsJSON.stringify({error: "A trilha escolhida est\xe1 vazia."});
}
for (var t = 0; t < n; t += 1) { 
var tr = null;
try {
tr = seq.audioTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var antes = false;
try {
antes = !(!tr.isMuted());
} catch (eI) {
}
estados.push({mudo: antes, t: t});
var querMudo = t !== idx;
if (querMudo !== antes) { 
try {
tr.setMute(querMudo ? 1 : 0);
mexeu = true;
} catch (eS) {
}
}}
}
var tmpName = "fs_transcribe_" + new Date().getTime() + ".mp3";
var outFileObj = new File(Folder.temp.fsName + "/" + tmpName);
var outNative = outFileObj.fsName;
var wat = typeof workAreaType === "number" ? workAreaType : 0;
if (wat === 0) { 
try {
inAntes = seq.getInPointAsTime();
} catch (eI0) {inAntes = null;
}
try {
outAntes = seq.getOutPointAsTime();
} catch (eO0) {outAntes = null;
}
var fimSeq = 0;
try {
fimSeq = parseFloat(seq.end) / 254016000000;
} catch (eF0) {
}
if (fimSeq > 0) { 
try {
seq.setInPoint(0);
seq.setOutPoint(fimSeq);
mexeuMarca = true;
} catch (eM0) {
}
}
}
try {
seq.exportAsMediaDirect(outNative, presetFile.fsName, wat);
} catch (eExp) {return _fsJSON.stringify({error: "Falha na exporta\xe7\xe3o: " + eExp.toString()});
}
var check = new File(outNative);
if ((!check.exists) || (check.length <= 0)) { 
return _fsJSON.stringify({error: "\xc1udio n\xe3o foi gerado (verifique se a trilha tem \xe1udio)."});
}
return _fsJSON.stringify({ok: true, path: check.fsName, trilha: idx});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
} finally {
if ((mexeu) && (seq)) { 
for (var r = 0; r < estados.length; r += 1) { 
try {
seq.audioTracks[estados[r].t].setMute(estados[r].mudo ? 1 : 0);
} catch (eR) {
}}
}
if ((mexeuMarca) && (seq)) { 
try {
if (inAntes !== null) { 
seq.setInPoint(inAntes.seconds);
}
} catch (eR4) {
}
try {
if (outAntes !== null) { 
seq.setOutPoint(outAntes.seconds);
}
} catch (eR5) {
}
}
}
}
function _fsSfxOcupados(track, tksOrdenados) {
var n = 0;
var ci = 0;
var nc = 0;
try {
nc = track.clips.numItems;
} catch (eN) {return 0;
}
for (var i = 0; i < tksOrdenados.length; i += 1) { 
var t = tksOrdenados[i];
while (ci < nc) {
var fim = NaN;
try {
fim = parseFloat(track.clips[ci].end.ticks);
} catch (eF) {fim = NaN;
}
if ((isNaN(fim)) || (fim > t)) { 
break ;
}
ci++;
}
if (ci >= nc) { 
break ;
}
var ini = NaN;
try {
ini = parseFloat(track.clips[ci].start.ticks);
} catch (eI) {ini = NaN;
}
if ((!isNaN(ini)) && (ini <= t)) { 
n++;
}}
return n;
}
function _fsSfxAcharPorNome(seq, nome) {
for (var t = 0; t < seq.audioTracks.numTracks; t += 1) { 
var nm = "";
try {
nm = seq.audioTracks[t].name;
} catch (e) {
}
if (nm === nome) { 
return t;
}}
return -1;
}
function _fsAddTrilhaAudio(seq) {
try {
function _subiu() {
var agora = -1;
try {
agora = seq.audioTracks.numTracks;
} catch (eN2) {return false;
}
return agora > antes;
}
if (!seq) { 
return false;
}
var antes = -1;
try {
antes = seq.audioTracks.numTracks;
} catch (eN) {return false;
}
if (antes < 0) { 
return false;
}
try {
seq.audioTracks.add();
} catch (e1) {
}
if (_subiu()) { 
return true;
}
var qs = null;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (e2) {
}
try {
qs = qe.project.getActiveSequence();
} catch (e3) {qs = null;
}
if ((qs) && (qs.addTracks)) { 
var idx = antes;
try {
qs.addTracks(0, 0, 1, 1, idx, 0, 0, 0);
} catch (e4) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(0, 0, 1, 1, idx, 0, 0);
} catch (e5) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(0, 0, 1, 1, idx);
} catch (e6) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(0, 0, 1, 1);
} catch (e7) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(0, 0, 1);
} catch (e8) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(0, 0, 1, 0, idx, 0, 0, 0);
} catch (e9) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(0, 0, 1, 0);
} catch (e10) {
}
if (_subiu()) { 
return true;
}
}
return false;
} catch (e) {return false;
}
}
function _fsSfxCriarTrilha(seq, nome) {
var antes = seq.audioTracks.numTracks;
_fsAddTrilhaAudio(seq);
if (seq.audioTracks.numTracks <= antes) { 
return -1;
}
var idx = seq.audioTracks.numTracks - 1;
var batizada = false;
try {
if (app.enableQE) { 
app.enableQE();
}
var qeS = qe.project.getActiveSequence();
if ((qeS) && (qeS.getAudioTrackAt)) { 
qeS.getAudioTrackAt(idx).setName(nome);
batizada = true;
}
} catch (eQE) {
}
if (!batizada) { 
try {
seq.audioTracks[idx].setName(nome);
} catch (eN) {
}
}
return idx;
}
function _fsSfxTrilhaDestino(seq, preferida, tksOrdenados, nomeDedicada) {
var ocup = 0;
if (((typeof preferida === "number") && (preferida >= 0)) && (preferida < seq.audioTracks.numTracks)) { 
ocup = _fsSfxOcupados(seq.audioTracks[preferida], tksOrdenados);
if (ocup === 0) { 
return {criada: false, doAluno: true, idx: preferida, mudou: false, nome: "A" + preferida + 1, ocupados: 0};
}
}
var d = _fsSfxAcharPorNome(seq, nomeDedicada);
if (d >= 0) { 
return {criada: false, doAluno: false, idx: d, mudou: ocup > 0, nome: nomeDedicada, ocupados: ocup};
}
var novo = _fsSfxCriarTrilha(seq, nomeDedicada);
if (novo < 0) { 
return null;
}
return {criada: true, doAluno: false, idx: novo, mudou: ocup > 0, nome: nomeDedicada, ocupados: ocup};
}
function distributeSfxAtTimes(sfxAbsPath, timesJson, frameOffset, audioTrackIndex, pathsJson, dbsJson, finsJson) {
try {
function _getSfxItem(absP) {
if (!absP) { 
return null;
}
var norm = absP.split("\\").join("/");
if (_sfxCache[norm]) { 
return _sfxCache[norm];
}
var f = new File(norm);
if (!f.exists) { 
return null;
}
var item = null;
for (var i = 0; i < app.project.rootItem.children.numItems; i += 1) { 
try {
var ch = app.project.rootItem.children[i];
if ((ch) && (ch.name === f.displayName)) { 
item = ch;
break ;
}
} catch (e) {
}}
if (!item) { 
app.project.importFiles([f.fsName], 1, app.project.rootItem, 0);
for (var j = 0; j < app.project.rootItem.children.numItems; j += 1) { 
try {
var c = app.project.rootItem.children[j];
if ((c) && (c.name === f.displayName)) { 
item = c;
break ;
}
} catch (e) {
}}
}
if (item) { 
_sfxCache[norm] = item;
}
return item;
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
try {
times = _fsJSON.parse(timesJson);
} catch (eT) {return _fsJSON.stringify({error: "Tempos inv\xe1lidos."});
}
var fins = null;
try {
if (finsJson) { 
fins = _fsJSON.parse(finsJson);
}
} catch (eF) {fins = null;
}
if ((fins) && ((!fins.length) || (fins.length !== times.length))) { 
fins = null;
}
if ((!times) || (!times.length)) { 
return _fsJSON.stringify({error: "Sem legendas para posicionar. Carregue um SRT ou transcreva primeiro."});
}
var paths = null;
if (pathsJson) { 
try {
paths = _fsJSON.parse(pathsJson);
} catch (eP) {paths = null;
}
}
if (((!paths) || (!paths.length)) && (sfxAbsPath)) { 
paths = [sfxAbsPath];
}
if ((!paths) || (!paths.length)) { 
return _fsJSON.stringify({error: "SFX n\xe3o informado."});
}
var dbLista = null;
if (dbsJson) { 
try {
dbLista = _fsJSON.parse(dbsJson);
} catch (eDb) {dbLista = null;
}
}
var volOkN = 0;
var volFalhaN = 0;
var cortados = 0;
var _sfxCache = {};
if (!_getSfxItem(paths[0])) { 
return _fsJSON.stringify({error: "Arquivo de SFX n\xe3o encontrado: " + paths[0]});
}
var TPS = 254016000000;
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = TPS / 30;
}
var offTicks = Math.round((parseFloat(frameOffset)) || (0) * tpf);
var tksOrd = [];
for (var tq = 0; tq < times.length; tq += 1) { 
var sq = times[tq];
if ((typeof sq !== "number") || (sq < 0)) { 
continue ;
}
var tq2 = Math.round(sq * TPS) + offTicks;
tksOrd.push(tq2 < 0 ? 0 : tq2);}
tksOrd.sort(function (a, b) {
return a - b;
});
var dest = _fsSfxTrilhaDestino(seq, audioTrackIndex, tksOrd, "FS SFX");
if (!dest) { 
return _fsJSON.stringify({error: "N\xe3o foi poss\xedvel criar a trilha de SFX."});
}
var targetIdx = dest.idx;
var targetTrack = seq.audioTracks[targetIdx];
var trackName = dest.nome;
var trilhaDoAluno = dest.doAluno;
if (!targetTrack) { 
return _fsJSON.stringify({error: "N\xe3o foi poss\xedvel criar a trilha de SFX."});
}
var count = 0;
var pulados = 0;
for (var k = 0; k < times.length; k += 1) { 
var secs = times[k];
if ((typeof secs !== "number") || (secs < 0)) { 
continue ;
}
var idxSom = k % paths.length;
var sfxItem = _getSfxItem(paths[idxSom]);
if (!sfxItem) { 
continue ;
}
var tk = Math.round(secs * TPS) + offTicks;
if (tk < 0) { 
tk = 0;
}
if (trilhaDoAluno) { 
var tSec = tk / TPS;
var ocupado = false;
for (var oc = 0; oc < targetTrack.clips.numItems; oc += 1) { 
var cOc = targetTrack.clips[oc];
if ((cOc.start.seconds <= tSec) && (cOc.end.seconds > tSec)) { 
ocupado = true;
break ;
}}
if (ocupado) { 
pulados++;
continue ;
}
}
var ticks = String(tk);
var inseriu = false;
try {
targetTrack.overwriteClip(sfxItem, ticks);
count++;
inseriu = true;
} catch (eIns) {
}
if (inseriu) { 
var novoCl = null;
for (var vk = 0; vk < targetTrack.clips.numItems; vk += 1) { 
var cv = null;
try {
cv = targetTrack.clips[vk];
} catch (eCv) {continue ;
}
if (!cv) { 
continue ;
}
var sv = NaN;
try {
sv = parseFloat(cv.start.ticks);
} catch (eSv) {continue ;
}
if ((!isNaN(sv)) && (Math.abs(sv - tk) < 2)) { 
novoCl = cv;
break ;
}}
if ((((novoCl) && (fins)) && (typeof fins[k] === "number")) && (fins[k] > secs)) { 
try {
var limTk = Math.round(fins[k] * TPS) + offTicks;
var fimAtual = NaN;
try {
fimAtual = parseFloat(novoCl.end.ticks);
} catch (eFa) {
}
if ((!isNaN(fimAtual)) && (fimAtual > limTk)) { 
novoCl.end = _fsAcTimeTicks(limTk);
cortados++;
}
} catch (eCut) {
}
}
if ((dbLista) && (dbLista.length)) { 
var dbEste = dbLista[idxSom % dbLista.length];
if ((typeof dbEste === "number") && (dbEste !== 0)) { 
if (novoCl) { 
var rv = null;
try {
rv = _fsSfxSetLevel(novoCl, dbEste);
} catch (eLv) {rv = null;
}
if ((rv) && (rv.ok)) { 
volOkN++;
}
else {
volFalhaN++;
}
}
else {
volFalhaN++;
}
}
}
}}
return _fsJSON.stringify({cortados: cortados, count: count, ok: true, pulados: pulados, sounds: paths.length, track: trackName, trilhaCriada: dest.criada ? 1 : 0, trilhaMudou: dest.mudou ? 1 : 0, trilhaOcupados: dest.ocupados, volumeFalha: volFalhaN, volumeOk: volOkN});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsNomesTransAudio() {
return ["Constant Power", "Pot\xeancia constante", "Potencia constante", "Exponential Fade", "Esmaecimento exponencial", "Fade exponencial", "Constant Gain", "Ganho constante"];
}
function _fsListaTransAudioQE() {
var out = [];
try {
var lst = qe.project.getAudioTransitionList();
if (lst) { 
for (var i = 0; i < lst.numTransitions; i += 1) { 
try {
out.push(String(lst[i].name));
} catch (e1) {
}}
}
} catch (e) {
}
return out;
}
function _fsAchaTransAudio() {
var nomes = _fsNomesTransAudio();
for (var i = 0; i < nomes.length; i += 1) { 
var tr = null;
try {
tr = qe.project.getAudioTransitionByName(nomes[i]);
} catch (e) {tr = null;
}
if (tr) { 
return {nome: nomes[i], obj: tr};
}}
var reais = _fsListaTransAudioQE();
for (var r = 0; r < reais.length; r += 1) { 
var n = _fsSemAcento(String(reais[r])).toLowerCase();
if ((((((n.indexOf("constant power") !== -1) || (n.indexOf("potencia constante") !== -1)) || (n.indexOf("exponential") !== -1)) || (n.indexOf("exponencial") !== -1)) || (n.indexOf("constant gain") !== -1)) || (n.indexOf("ganho constante") !== -1)) { 
var t2 = null;
try {
t2 = qe.project.getAudioTransitionByName(reais[r]);
} catch (e2) {t2 = null;
}
if (t2) { 
return {nome: String(reais[r]), obj: t2};
}
}}
return null;
}
function _fsQeItemAudio(trackIdx, startTicks, folga) {
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (e) {return null;
}
if (!qs) { 
return null;
}
var qtr = null;
try {
qtr = qs.getAudioTrackAt(trackIdx);
} catch (e2) {return null;
}
if (!qtr) { 
return null;
}
var n = 0;
try {
n = qtr.numItems;
} catch (e3) {return null;
}
for (var i = 0; i < n; i += 1) { 
var it = null;
try {
it = qtr.getItemAt(i);
} catch (e4) {continue ;
}
if (!it) { 
continue ;
}
var ty = "";
try {
ty = String(it.type);
} catch (e5) {
}
if (ty === "Empty") { 
continue ;
}
var st = NaN;
try {
st = parseFloat(it.start.ticks);
} catch (e6) {continue ;
}
if (Math.abs(st - startTicks) <= folga) { 
return it;
}}
return null;
}
function _fsContaTransAudio(seq, trackIdx) {
var n = 0;
try {
var tr = seq.audioTracks[trackIdx];
if ((tr) && (tr.transitions)) { 
n = tr.transitions.numItems;
}
} catch (e) {
}
return n;
}
function _fsTrilhaFimDoVideo(seq) {
var fim = 0;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (mgt) { 
continue ;
}
var f = 0;
try {
f = cl.end.seconds;
} catch (eF) {f = 0;
}
if (f > fim) { 
fim = f;
}}}
return fim;
}
function fsAutoTrilhaAplicar(optsJson) {
try {
function _acharPorNome(pasta, alvoNome) {
for (var i = 0; i < pasta.children.numItems; i += 1) { 
var it = pasta.children[i];
if (!it) { 
continue ;
}
if (it.type === ProjectItemType.BIN) { 
var s = _acharPorNome(it, alvoNome);
if (s) { 
return s;
}
}
else {
var mp = "";
try {
mp = it.getMediaPath();
} catch (eMp) {mp = "";
}
if ((mp) && (mp.split("/").pop().split("\\").pop() === alvoNome)) { 
return it;
}
}}
return null;
}
function _itemDaTrilha(caminho) {
if (cacheItens[caminho] !== undefined) { 
return cacheItens[caminho];
}
var f2 = new File(String(caminho).split("\\").join("/"));
if (!f2.exists) { 
cacheItens[caminho] = null;
return null;
}
var alvoNome = f2.fsName.split("/").pop().split("\\").pop();
var achado = _acharPorNome(app.project.rootItem, alvoNome);
if (!achado) { 
try {
app.project.importFiles([f2.fsName], 1, (app.project.getInsertionBin()) || (app.project.rootItem), 0);
} catch (eI) {
}
achado = _acharPorNome(app.project.rootItem, alvoNome);
}
cacheItens[caminho] = achado;
return achado;
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {o = null;
}
var paths = ((o) && (o.paths)) && (o.paths.length) ? o.paths : (o) && (o.path) ? [o.path] : null;
if (!paths) { 
return _fsJSON.stringify({error: "Trilha n\xe3o informada."});
}
var dbs = ((o) && (o.dbs)) && (o.dbs.length) ? o.dbs : [];
var db = typeof o.db === "number" ? o.db : -25;
var fadeSeg = (typeof o.fade === "number") && (o.fade > 0) ? o.fade : 1.5;
var TPS = 254016000000;
var fimSec = _fsTrilhaFimDoVideo(seq);
if (!(fimSec > 0)) { 
return _fsJSON.stringify({error: "Nenhum clipe de v\xeddeo na timeline \u2014 n\xe3o sei a dura\xe7\xe3o a cobrir."});
}
var fimTk = Math.round(fimSec * TPS);
var cacheItens = {};
if (!_itemDaTrilha(paths[0])) { 
return _fsJSON.stringify({error: "N\xe3o consegui importar a trilha pro projeto."});
}
var dest = _fsSfxTrilhaDestino(seq, -1, [], "FS TRILHA");
if ((!dest) || (dest.idx < 0)) { 
return _fsJSON.stringify({error: "N\xe3o consegui criar a trilha FS TRILHA. Crie uma trilha de \xe1udio vazia e tente de novo."});
}
var tr2 = seq.audioTracks[dest.idx];
if (!tr2) { 
return _fsJSON.stringify({error: "Trilha FS TRILHA inacess\xedvel."});
}
var tiradas = 0;
for (var r = tr2.clips.numItems - 1; r >= 0; r--) { 
try {
tr2.clips[r].remove(false, false);
tiradas++;
} catch (eR) {
}}
var clipes = 0;
var volOk = 0;
var volFalha = 0;
var cortada = 0;
var usadas = [];
var inicios = [];
var tk = 0;
var MAXC = 200;
var iTrilha = 0;
while ((tk < fimTk) && (clipes < MAXC)) {
var caminhoAtual = paths[iTrilha % paths.length];
var item = _itemDaTrilha(caminhoAtual);
if (!item) { 
iTrilha++;
if (iTrilha > (paths.length * 2)) { 
break ;
}
continue ;
}
var antes = tr2.clips.numItems;
try {
tr2.overwriteClip(item, String(tk));
} catch (eO) {break ;
}
if (tr2.clips.numItems <= antes) { 
break ;
}
var novo = null;
for (var k = 0; k < tr2.clips.numItems; k += 1) { 
var cv = tr2.clips[k];
var sv = NaN;
try {
sv = parseFloat(cv.start.ticks);
} catch (eS) {continue ;
}
if ((!isNaN(sv)) && (Math.abs(sv - tk) < 2)) { 
novo = cv;
break ;
}}
if (!novo) { 
break ;
}
clipes++;
if (usadas.length < 12) { 
usadas.push(caminhoAtual.split("/").pop().split("\\").pop().replace(/\.[^.]+$/, ""));
}
inicios.push(tk);
var fimClipe = NaN;
try {
fimClipe = parseFloat(novo.end.ticks);
} catch (eE) {fimClipe = NaN;
}
if ((isNaN(fimClipe)) || (fimClipe <= tk)) { 
break ;
}
if (fimClipe > fimTk) { 
try {
novo.end = _fsAcTimeTicks(fimTk);
cortada = 1;
} catch (eCt) {
}
fimClipe = fimTk;
}
var dbEste = dbs.length ? dbs[iTrilha % dbs.length] : db;
if (typeof dbEste !== "number") { 
dbEste = db;
}
if (dbEste !== 0) { 
var rv = null;
try {
rv = _fsSfxSetLevel(novo, dbEste);
} catch (eL) {rv = null;
}
if ((rv) && (rv.ok)) { 
volOk++;
}
else {
volFalha++;
}
}
tk = fimClipe;
iTrilha++;
}
if (!clipes) { 
return _fsJSON.stringify({error: "N\xe3o consegui inserir a trilha (a faixa recusou o clipe)."});
}
var emendas = Math.max(0, clipes - 1);
var fadeOk = 0;
var fadeModo = "";
var fadeDiag = "";
if (emendas > 0) { 
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeVivo = false;
try {
qeVivo = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeVivo = false;
}
var trAudio = null;
if (qeVivo) { 
try {
trAudio = _fsAchaTransAudio();
} catch (eTa) {trAudio = null;
}
}
if (!qeVivo) { 
fadeDiag = "o motor do Premiere (QE) nao respondeu";
}
else {
if (!trAudio) { 
var reais = _fsListaTransAudioQE();
fadeDiag = reais.length ? "nao achei Constant Power; a lista do QE tem " + reais.length + " transicoes de audio: " + reais.slice(0, 6).join(", ") : "o QE nao devolveu nenhuma transicao de audio (getAudioTransitionList vazio)";
}
}
var tpfT = 0;
try {
tpfT = parseFloat(seq.timebase);
} catch (eTb) {
}
if (!(tpfT > 0)) { 
tpfT = TPS / 30;
}
var halfT = tpfT / 2;
var durStr = String(Math.round(fadeSeg * TPS));
if (trAudio) { 
for (var e2 = 1; e2 < inicios.length; e2 += 1) { 
var antesT = _fsContaTransAudio(seq, dest.idx);
var qeIt = _fsQeItemAudio(dest.idx, inicios[e2], halfT);
if (!qeIt) { 
continue ;
}
var f3 = false;
try {
qeIt.addTransition(trAudio.obj, true, durStr, "0", 0.5, false, false);
f3 = true;
} catch (eA1) {
}
if (!f3) { 
try {
qeIt.addTransition(trAudio.obj, true, durStr, "0", 0.5);
f3 = true;
} catch (eA2) {
}
}
if (!f3) { 
try {
qeIt.addTransition(trAudio.obj, true, durStr);
f3 = true;
} catch (eA3) {
}
}
if (!f3) { 
try {
qeIt.addTransition(trAudio.obj, true);
f3 = true;
} catch (eA4) {
}
}
if (_fsContaTransAudio(seq, dest.idx) > antesT) { 
fadeOk++;
}}
if (fadeOk > 0) { 
fadeModo = trAudio.nome;
}
else {
fadeDiag = "achei \"" + trAudio.nome + "\" mas o addTransition nao entrou (a contagem da trilha nao subiu)";
}
}
if (fadeOk === 0) { 
var nivelBase = _fsDbParaLevel(db);
if (nivelBase !== null) { 
for (var c3 = 0; c3 < tr2.clips.numItems; c3 += 1) { 
var cl3 = tr2.clips[c3];
var s3 = NaN;
var e3 = NaN;
try {
s3 = cl3.start.seconds;
e3 = cl3.end.seconds;
} catch (eSe) {continue ;
}
if (((isNaN(s3)) || (isNaN(e3))) || ((e3 - s3) < ((fadeSeg * 2) + 0.2))) { 
continue ;
}
var prop3 = _fsNivelDoClipe(cl3);
if (!prop3) { 
continue ;
}
var base3 = NaN;
try {
base3 = parseFloat(cl3.inPoint.seconds);
} catch (eIp) {base3 = 0;
}
if (isNaN(base3)) { 
base3 = 0;
}
var dur3 = e3 - s3;
try {
if (typeof prop3.setTimeVarying === "function") { 
prop3.setTimeVarying(true);
}
var pares = [];
if (c3 > 0) { 
pares.push([base3, 0]);
pares.push([base3 + fadeSeg, nivelBase]);
}
pares.push([(base3 + dur3) - fadeSeg, nivelBase]);
pares.push([(base3 + dur3) - 0.02, 0]);
for (var p3 = 0; p3 < pares.length; p3 += 1) { 
try {
prop3.addKey(pares[p3][0]);
} catch (eK) {
}
try {
prop3.setValueAtKey(pares[p3][0], pares[p3][1], true);
} catch (eV) {
}}
fadeOk++;
} catch (eFb) {
}}
if (fadeOk > 0) { 
fadeModo = "fade por keyframes";
}
}
}
}
return _fsJSON.stringify({clipes: clipes, cortada: cortada, criada: dest.criada ? 1 : 0, db: db, duracao: fimSec, emendas: emendas, fadeDiag: fadeDiag, fadeModo: fadeModo, fadeOk: fadeOk, ok: true, substituiu: tiradas, track: (dest.nome) || ("FS TRILHA"), trilhas: usadas, volumeFalha: volFalha, volumeOk: volOk});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsAutoTrilhaRemover() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var idx = _fsSfxAcharPorNome(seq, "FS TRILHA");
if (idx < 0) { 
return _fsJSON.stringify({ok: true, tiradas: 0});
}
var tr = seq.audioTracks[idx];
var tiradas = 0;
for (var r = tr.clips.numItems - 1; r >= 0; r--) { 
try {
tr.clips[r].remove(false, false);
tiradas++;
} catch (eR) {
}}
return _fsJSON.stringify({ok: true, tiradas: tiradas});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function clearAutoSfx() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var trackName = "FS SFX";
var found = false;
var removed = 0;
for (var t = 0; t < seq.audioTracks.numTracks; t += 1) { 
var tr = seq.audioTracks[t];
var nm = "";
try {
nm = tr.name;
} catch (e) {
}
if (nm === trackName) { 
found = true;
for (var c = tr.clips.numItems - 1; c >= 0; c--) { 
try {
tr.clips[c].remove(false, false);
removed++;
} catch (eR) {
}}
}}
return _fsJSON.stringify({found: found, ok: true, removed: removed});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsNormalizeRuns(o) {
if (((!o) || (!o.fontTextRunLength)) || (!o.fontTextRunLength.length)) { 
return;
}
var n = typeof o.textEditValue === "string" ? o.textEditValue.length : 0;
var arr = o.fontTextRunLength;
var sum = 0;
for (var _i = 0; _i < arr.length; _i += 1) { 
sum += arr[_i];}
if (sum === n) { 
return;
}
var acc = 0;
for (var _j = 0; _j < arr.length; _j += 1) { 
var rem = n - acc;
if (rem <= 0) { 
arr[_j] = 0;
continue ;
}
if (arr[_j] > rem) { 
arr[_j] = rem;
}
acc += arr[_j];}
if (acc < n) { 
arr[arr.length - 1] += (n - acc);
}
}
function _fsScAchaTexto(props) {
if (!props) { 
return null;
}
var n = 0;
try {
n = props.numItems;
} catch (e) {return null;
}
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = props[i];
} catch (eP) {continue ;
}
if (!p) { 
continue ;
}
var kids = 0;
try {
kids = (p.numItems) || (0);
} catch (eK) {kids = 0;
}
if (kids > 0) { 
var d = _fsScAchaTexto(p);
if (d) { 
return d;
}
continue ;
}
try {
var v = p.getValue();
if ((typeof v === "string") && (v.indexOf("fontEditValue") !== -1)) { 
return v;
}
} catch (eV) {
}}
return null;
}
function _fsScFonteNaProp(pa, psFont, familyName, styleName) {
if ((!pa) || (!psFont)) { 
return false;
}
try {
var v = pa.getValue();
if ((typeof v === "string") && (v.indexOf("fontEditValue") !== -1)) { 
var o = _fsJSON.parse(v);
var runs = 1;
try {
if ((((o.fontEditValue) && (typeof o.fontEditValue !== "string")) && (typeof o.fontEditValue.length === "number")) && (o.fontEditValue.length)) { 
runs = o.fontEditValue.length;
}
} catch (eR) {
}
var ps = psFont.indexOf(" ") !== -1 ? psFont.replace(/\s+/g, "-") : psFont;
o.fontEditValue = [];
var fam = [];
var sty = [];
for (var r = 0; r < runs; r += 1) { 
o.fontEditValue.push(ps);
fam.push((familyName) || (""));
sty.push((styleName) || (""));}
if (familyName) { 
o.fontFamilyName = fam;
}
if (styleName) { 
o.fontStyleName = sty;
}
pa.setValue(_fsJSON.stringify(o), true);
return true;
}
} catch (e1) {
}
return false;
}
function _setBlockFont(props, psFont, familyName, styleName) {
if ((!props) || (!psFont)) { 
return false;
}
for (var a = 0; a < props.numItems; a += 1) { 
var pa = props[a];
if (!pa) { 
continue ;
}
var kids = false;
try {
kids = pa.numItems > 0;
} catch (e0) {
}
if (kids) { 
if (_setBlockFont(pa, psFont, familyName, styleName)) { 
return true;
}
continue ;
}
if (_fsScFonteNaProp(pa, psFont, familyName, styleName)) { 
return true;
}}
return false;
}
function _setBlockText(props, text) {
if (!props) { 
return false;
}
for (var a = 0; a < props.numItems; a += 1) { 
var pa = props[a];
if (!pa) { 
continue ;
}
var kidsA = false;
try {
kidsA = pa.numItems > 0;
} catch (e0) {
}
if (kidsA) { 
if (_setBlockText(pa, text)) { 
return true;
}
continue ;
}
try {
var v = pa.getValue();
if ((typeof v === "string") && (v.indexOf("textEditValue") !== -1)) { 
var o = _fsJSON.parse(v);
if ((o) && (o.textEditValue !== undefined)) { 
o.textEditValue = text;
_fsNormalizeRuns(o);
pa.setValue(_fsJSON.stringify(o), true);
return true;
}
}
} catch (e1) {
}}
for (var b = 0; b < props.numItems; b += 1) { 
var pb = props[b];
if (!pb) { 
continue ;
}
var kidsB = false;
try {
kidsB = pb.numItems > 0;
} catch (e2) {
}
if (kidsB) { 
if (_setBlockText(pb, text)) { 
return true;
}
continue ;
}
try {
var v2 = pb.getValue();
if ((typeof v2 === "string") && (v2.indexOf("textEditValue") === -1)) { 
var pf = parseFloat(v2);
if ((((isNaN(pf)) && (v2.indexOf("#") === -1)) && (v2.indexOf("[") === -1)) && (v2.length < 500)) { 
pb.setValue(text, true);
return true;
}
}
} catch (e3) {
}}
return false;
}
function _dumpBlockProps(props) {
function walk(p, d) {
if ((d > 4) || (!p)) { 
return;
}
for (var i = 0; (i < p.numItems) && (out.length < 14); i += 1) { 
var c = p[i];
if (!c) { 
continue ;
}
var nm = "";
try {
nm = c.displayName;
} catch (e0) {
}
var kids = false;
try {
kids = c.numItems > 0;
} catch (e1) {
}
if (kids) { 
out.push("[G]" + nm);
walk(c, d + 1);
continue ;
}
var v = "";
try {
v = c.getValue();
} catch (e2) {v = "(err)";
}
var t = typeof v;
var prev = t === "string" ? v.substring(0, 60) : String(v);
out.push(nm + " <" + t + ">=" + prev);}
}
var out = [];
walk(props, 0);
return out.join(" || ");
}
function getSequenceInOut() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var inSec = NaN;
var outSec = NaN;
try {
var inT = seq.getInPointAsTime();
if ((inT) && (typeof inT.seconds === "number")) { 
inSec = inT.seconds;
}
} catch (e1) {
}
try {
var outT = seq.getOutPointAsTime();
if ((outT) && (typeof outT.seconds === "number")) { 
outSec = outT.seconds;
}
} catch (e2) {
}
if (isNaN(inSec)) { 
try {
inSec = parseFloat(seq.getInPoint());
} catch (e3) {
}
}
if (isNaN(outSec)) { 
try {
outSec = parseFloat(seq.getOutPoint());
} catch (e4) {
}
}
if (isNaN(inSec)) { 
inSec = 0;
}
if (isNaN(outSec)) { 
outSec = 0;
}
var durSec = 0;
try {
durSec = parseFloat(seq.end) / 254016000000;
} catch (eD) {
}
if (isNaN(durSec)) { 
durSec = 0;
}
var coversAll = ((inSec <= 0.001) && (durSec > 0)) && (outSec >= (durSec - 0.05));
var hasRange = (outSec > (inSec + 0.001)) && (!coversAll);
return _fsJSON.stringify({durSec: durSec, hasRange: hasRange, inSec: inSec, ok: true, outSec: outSec});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsTirarBlocosLegenda(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if ((((!o) || (typeof o.trilha !== "number")) || (!o.tempos)) || (!o.tempos.length)) { 
return _fsJSON.stringify({error: "SEM_MEMORIA"});
}
if ((o.trilha < 0) || (o.trilha >= seq.videoTracks.numTracks)) { 
return _fsJSON.stringify({error: "TRILHA_SUMIU", trilha: "V" + o.trilha + 1});
}
var tr = seq.videoTracks[o.trilha];
try {
if ((tr.isLocked) && (tr.isLocked())) { 
return _fsJSON.stringify({error: "TRILHA_TRAVADA", trilha: "V" + o.trilha + 1});
}
} catch (eL) {
}
var tpf = _fsAcTpf(seq);
var folga = (tpf / 2) / 254016000000;
var tirados = 0;
var naoEram = 0;
var naoAchados = 0;
for (var t = 0; t < o.tempos.length; t += 1) { 
var alvo = o.tempos[t];
var achou = false;
for (var c = tr.clips.numItems - 1; c >= 0; c--) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var s = NaN;
try {
s = parseFloat(cl.start.seconds);
} catch (eS) {continue ;
}
if ((isNaN(s)) || (Math.abs(s - alvo) > folga)) { 
continue ;
}
achou = true;
var ehMogrt = false;
try {
ehMogrt = !(!cl.getMGTComponent());
} catch (eM) {ehMogrt = false;
}
if (!ehMogrt) { 
naoEram++;
break ;
}
try {
cl.remove(false, false);
tirados++;
} catch (eR) {
}
break ;}
if (!achou) { 
naoAchados++;
}}
return _fsJSON.stringify({naoAchados: naoAchados, naoEram: naoEram, ok: true, sobrou: (function () {
try {
return tr.clips.numItems;
} catch (e) {return -1;
}
})(), tirados: tirados, total: o.tempos.length, trilha: "V" + o.trilha + 1});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsPrendeNoFrame(ticks, tpf) {
if (!(tpf > 0)) { 
return ticks;
}
return Math.round(ticks / tpf) * tpf;
}
function insertCaptionBlocks(mogrtPath, captionsJson, trackIndex, startIdx, chunkCount, rangeInSec, rangeOutSec, fontJson) {
try {
function _fsSpanDasLegendas() {
var ini = null;
var fim = null;
for (var sp = 0; sp < caps.length; sp += 1) { 
var cp = caps[sp];
if ((!cp) || (typeof cp.startTime !== "number")) { 
continue ;
}
if (((typeof rangeInSec === "number") && (typeof rangeOutSec === "number")) && (rangeOutSec > rangeInSec)) { 
if ((cp.startTime < (rangeInSec - 0.0005)) || (cp.startTime >= rangeOutSec)) { 
continue ;
}
}
var enSp = (typeof cp.endTime === "number") && (cp.endTime > cp.startTime) ? cp.endTime : cp.startTime + 2;
if ((ini === null) || (cp.startTime < ini)) { 
ini = cp.startTime;
}
if ((fim === null) || (enSp > fim)) { 
fim = enSp;
}}
return ini === null ? null : {fim: fim, ini: ini};
}
function _fsTrilhaOcupada(idx, ini, fim) {
try {
var trOc = seq.videoTracks[idx];
for (var oc = 0; oc < trOc.clips.numItems; oc += 1) { 
var clOc = trOc.clips[oc];
if ((clOc.start.seconds < fim) && (clOc.end.seconds > ini)) { 
return true;
}}
return false;
} catch (eOc) {return true;
}
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
try {
caps = _fsJSON.parse(captionsJson);
} catch (eC) {return _fsJSON.stringify({error: "Legendas inv\xe1lidas."});
}
if ((!caps) || (!caps.length)) { 
return _fsJSON.stringify({error: "Sem legendas. Transcreva ou importe um SRT primeiro."});
}
var blockFile = new File(String(mogrtPath).split("\\").join("/"));
if (!blockFile.exists) { 
return _fsJSON.stringify({error: "Bloco base n\xe3o encontrado: " + mogrtPath});
}
var TPS = 254016000000;
var targetIdx = (typeof trackIndex === "number") && (trackIndex >= 0) ? trackIndex : -1;
var avisoTrilha = "";
var primeiraLeva = !((typeof startIdx === "number") && (startIdx > 0));
var spanLeg = primeiraLeva ? _fsSpanDasLegendas() : null;
if (targetIdx < 0) { 
var before = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
if (seq.videoTracks.numTracks > before) { 
targetIdx = seq.videoTracks.numTracks - 1;
}
else {
targetIdx = -1;
if (spanLeg) { 
for (var tl = seq.videoTracks.numTracks - 1; tl >= 0; tl--) { 
var travaTl = false;
try {
travaTl = seq.videoTracks[tl].isLocked();
} catch (eTv) {
}
if (travaTl) { 
continue ;
}
if (!_fsTrilhaOcupada(tl, spanLeg.ini, spanLeg.fim)) { 
targetIdx = tl;
break ;
}}
}
if (targetIdx < 0) { 
return _fsJSON.stringify({error: "Nao consegui criar trilha nova e nenhuma existente esta livre no trecho das legendas. Libere uma trilha de video ou crie uma manualmente."});
}
avisoTrilha = "Nao consegui criar trilha nova; usei a V" + targetIdx + 1 + ", que estava livre.";
}
}
else {
while (targetIdx >= seq.videoTracks.numTracks) {
var _antesV = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
if (seq.videoTracks.numTracks <= _antesV) { 
break ;
}
}
var travaPedida = false;
if ((primeiraLeva) && (targetIdx < seq.videoTracks.numTracks)) { 
try {
travaPedida = seq.videoTracks[targetIdx].isLocked();
} catch (eTrv) {travaPedida = false;
}
}
if ((((primeiraLeva) && (spanLeg)) && (targetIdx < seq.videoTracks.numTracks)) && ((travaPedida) || (_fsTrilhaOcupada(targetIdx, spanLeg.ini, spanLeg.fim)))) { 
var pedidoIdx = targetIdx;
var achou = -1;
for (var ts = targetIdx + 1; ts < seq.videoTracks.numTracks; ts++) { 
var travaTs = false;
try {
travaTs = seq.videoTracks[ts].isLocked();
} catch (eTs) {
}
if (travaTs) { 
continue ;
}
if (!_fsTrilhaOcupada(ts, spanLeg.ini, spanLeg.fim)) { 
achou = ts;
break ;
}}
if (achou < 0) { 
var b2 = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
if (seq.videoTracks.numTracks > b2) { 
achou = seq.videoTracks.numTracks - 1;
}
}
if (achou < 0) { 
return _fsJSON.stringify({error: travaPedida ? "A V" + pedidoIdx + 1 + " esta com o cadeado ligado" : "A V" + pedidoIdx + 1 + " esta ocupada no trecho das legendas" + " e nao consegui criar trilha nova. " + travaPedida ? "Destrave a trilha" : "Libere uma trilha" + " ou crie uma manualmente."});
}
targetIdx = achou;
avisoTrilha = travaPedida ? "A V" + pedidoIdx + 1 + " esta com o cadeado ligado; os blocos foram pra V" + targetIdx + 1 + "." : "A V" + pedidoIdx + 1 + " estava ocupada no trecho das legendas (camada de ajuste?); os blocos foram pra V" + targetIdx + 1 + " pra nao passar por cima.";
}
}
if ((targetIdx < 0) || (targetIdx >= seq.videoTracks.numTracks)) { 
return _fsJSON.stringify({error: "Trilha V" + targetIdx + 1 + " n\xe3o existe e n\xe3o consegui criar."});
}
var fonte = null;
try {
if (fontJson) { 
fonte = _fsJSON.parse(fontJson);
}
} catch (eFj) {fonte = null;
}
if ((fonte) && (!fonte.ps)) { 
fonte = null;
}
var fontSet = 0;
var _tpf = 0;
try {
var _vfr = seq.getSettings().videoFrameRate;
if ((_vfr) && (_vfr.ticks)) { 
_tpf = parseFloat(_vfr.ticks);
}
} catch (eTpf) {
}
var si = (typeof startIdx === "number") && (startIdx > 0) ? startIdx : 0;
var cc = (typeof chunkCount === "number") && (chunkCount > 0) ? chunkCount : caps.length;
var end = Math.min(si + cc, caps.length);
var count = 0;
var _falhas = 0;
var _falhaTempos = [];
var _dbgW = 0;
var _dbgH = 0;
var _dbgMotion = false;
var _dbgScale = false;
var _dbgPos = false;
var _dbgNP = 0;
for (var i = si; i < end; i += 1) { 
var cap = caps[i];
if ((!cap) || (typeof cap.startTime !== "number")) { 
continue ;
}
if (((typeof rangeInSec === "number") && (typeof rangeOutSec === "number")) && (rangeOutSec > rangeInSec)) { 
if ((cap.startTime < (rangeInSec - 0.0005)) || (cap.startTime >= rangeOutSec)) { 
continue ;
}
}
var _stT = _fsPrendeNoFrame(Math.round(cap.startTime * TPS), _tpf);
var enSec = (typeof cap.endTime === "number") && (cap.endTime > cap.startTime) ? cap.endTime : cap.startTime + 2;
var _enT = _fsPrendeNoFrame(Math.round(enSec * TPS), _tpf);
if ((_tpf > 0) && (_enT <= _stT)) { 
_enT = _stT + _tpf;
}
var stTicks = String(_stT);
var enTicks = String(_enT);
var clip = null;
try {
clip = seq.importMGT(blockFile.fsName, stTicks, targetIdx, 0);
} catch (eMgt) {
}
if (!clip) { 
_falhas += 1;
if (_falhaTempos.length < 5) { 
_falhaTempos.push(Math.round(cap.startTime * 10) / 10);
}
continue ;
}
try {
var mgt = clip.getMGTComponent();
if (mgt) { 
_setBlockText(mgt.properties, (cap.text) || (""));
if (fonte) { 
if (_setBlockFont(mgt.properties, fonte.ps, fonte.family, fonte.style)) { 
fontSet += 1;
}
}
}
} catch (eTxt) {
}
try {
var _sw = 1920;
var _sh = 1080;
try {
var _ss = seq.getSettings();
if (_ss) { 
if (_ss.videoFrameWidth) { 
_sw = _ss.videoFrameWidth;
}
if (_ss.videoFrameHeight) { 
_sh = _ss.videoFrameHeight;
}
}
} catch (eS) {
}
if ((!_sw) || (!_sh)) { 
try {
if (seq.frameSizeHorizontal) { 
_sw = seq.frameSizeHorizontal;
}
if (seq.frameSizeVertical) { 
_sh = seq.frameSizeVertical;
}
} catch (eFS) {
}
}
_dbgW = _sw;
_dbgH = _sh;
var _isH = _sw > _sh;
var _posX = null;
var _posY = null;
if (_isH) { 
_spct = Math.round(((_sh / 1080) * 100) / 5) * 5;
_posY = Math.round((_sh * 500) / 1080);
_posX = Math.round(_sw / 2);
}
else {
_spct = Math.round(((_sw / 1080) * 100) / 5) * 5;
}
if (_spct < 25) { 
_spct = 100;
}
if (_spct > 400) { 
_spct = 400;
}
var _cps = null;
try {
_cps = clip.components;
} catch (eC) {
}
var _ncp = 0;
try {
_ncp = _cps ? _cps.numItems : 0;
} catch (eN) {
}
for (var _ci = 0; _ci < _ncp; _ci += 1) { 
var _cc = null;
try {
_cc = _cps[_ci];
} catch (e) {continue ;
}
if (!_cc) { 
continue ;
}
var _ccn = "";
try {
_ccn = (_cc.displayName) || ("").toLowerCase();
} catch (e) {
}
if (((_ccn.indexOf("motion") !== -1) || (_ccn.indexOf("movimento") !== -1)) || (_ccn.indexOf("movimiento") !== -1)) { 
_dbgMotion = true;
var _pps = null;
try {
_pps = _cc.properties;
} catch (e) {
}
var _npp = 0;
try {
_npp = _pps ? _pps.numItems : 0;
} catch (e) {
}
_dbgNP = _npp;
for (var _pi = 0; _pi < _npp; _pi += 1) { 
var _pp = null;
try {
_pp = _pps[_pi];
} catch (e) {continue ;
}
if (!_pp) { 
continue ;
}
var _ppn = "";
try {
_ppn = (_pp.displayName) || ("").toLowerCase();
} catch (e) {
}
var _isScaleProp = ((((((_ppn.indexOf("scale") === 0) || (_ppn.indexOf("escala") === 0)) && (_ppn.indexOf("width") === -1)) && (_ppn.indexOf("largura") === -1)) && (_ppn.indexOf("ancho") === -1)) && (_ppn.indexOf("uniform") === -1)) && (_ppn.indexOf("uniforme") === -1);
var _isPosProp = _ppn.indexOf("posi") === 0;
if ((!_isScaleProp) && (!_isPosProp)) { 
if (_pi === 0) { 
_isPosProp = true;
}
else {
if (_pi === 1) { 
_isScaleProp = true;
}
}
}
if (_isScaleProp) { 
try {
_pp.setValue(_spct, true);
_dbgScale = true;
} catch (eSc) {
}
}
if ((_isPosProp) && (_posX !== null)) { 
try {
_pp.setValue([Math.max(0, Math.min(1, _posX / _sw)), Math.max(0, Math.min(1, _posY / _sh))], true);
_dbgPos = true;
} catch (ePo) {
}
}}
break ;
}}
} catch (eScale) {
}
try {
var _nm = ("" + (cap.text) || ("Legenda")).substring(0, 40);
try {
clip.name = _nm;
} catch (eN1) {
}
try {
if (clip.projectItem) { 
clip.projectItem.name = _nm;
}
} catch (eN2) {
}
} catch (eName) {
}
try {
var endObj = clip.end;
endObj.ticks = enTicks;
clip.end = endObj;
} catch (eEnd) {
}
count += 1;}
return _fsJSON.stringify({aviso: avisoTrilha, dbgH: _dbgH, dbgMotion: _dbgMotion, dbgNP: _dbgNP, dbgPos: _dbgPos, dbgScale: _dbgScale, dbgW: _dbgW, done: end >= caps.length, falhaTempos: _falhaTempos, falhas: _falhas, fontSet: fontSet, inserted: count, nextIdx: end, ok: true, track: targetIdx + 1, trackIndex: targetIdx});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsSondaEscopo() {
function t(nome) {
try {
return eval("typeof " + nome);
} catch (eT) {return "erro";
}
}
var mapa = {};
try {
mapa.build = typeof FS_HOST_BUILD !== "undefined" ? FS_HOST_BUILD : "sem marcador";
} catch (e0) {mapa.build = "?";
}
mapa.linha1337 = t("importSRTCaptions");
mapa.linha2042 = t("fsLegendasDaTimeline");
mapa.linha2721 = t("distributeSfxAtTimes");
mapa.linha3942 = t("injectMogrtPremiere");
mapa.linha4425 = t("_fsAchaAudioPorCaminho");
mapa.fimDoArquivo = t("fsSondaEfeitos");
return mapa;
}
function _fsSubAchaItem(fsName, nome) {
function desce(pasta) {
for (var i = 0; i < pasta.children.numItems; i += 1) { 
var it = pasta.children[i];
if (!it) { 
continue ;
}
var eBin = false;
try {
eBin = it.type === ProjectItemType.BIN;
} catch (eB) {
}
if (eBin) { 
var achou = desce(it);
if (achou) { 
return achou;
}
continue ;
}
var mp = "";
try {
if (it.getMediaPath) { 
mp = String(it.getMediaPath());
}
} catch (eMP) {
}
if ((mp) && (mp.replace(/\\/g, "/").toLowerCase() === alvo)) { 
return it;
}
if ((!porNome) && ((it.name === nome) || (it.name === semExt))) { 
porNome = it;
}}
return null;
}
var alvo = String((fsName) || ("")).replace(/\\/g, "/").toLowerCase();
var semExt = String((nome) || ("")).replace(/\.[^.]+$/, "");
var porNome = null;
var certo = desce(app.project.rootItem);
return (certo) || (porNome);
}
function fsSubtitulosImportar(srtPath) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequencia ativa.", sonda: _fsSondaEscopo()});
}
if (typeof seq.createCaptionTrack !== "function") { 
return _fsJSON.stringify({error: "Este Premiere nao expoe createCaptionTrack por script. Caminho manual: painel Texto > Legendas > Importar legendas do arquivo.", sonda: _fsSondaEscopo()});
}
var f = new File(srtPath);
if (!f.exists) { 
return _fsJSON.stringify({error: "Nao achei o SRT temporario: " + srtPath, sonda: _fsSondaEscopo()});
}
try {
app.project.importFiles([f.fsName], 1, (app.project.getInsertionBin()) || (app.project.rootItem), 0);
} catch (eImp) {
}
var item = _fsSubAchaItem(f.fsName, f.name);
if (!item) { 
return _fsJSON.stringify({error: "Importei o SRT mas nao achei o item no projeto.", sonda: _fsSondaEscopo()});
}
return _fsJSON.stringify({ok: true, sonda: _fsSondaEscopo()});
} catch (e) {return _fsJSON.stringify({error: e.toString(), sonda: _fsSondaEscopo()});
}
}
function fsSubtitulosCriarTrilha(srtPath) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequencia ativa."});
}
var f = new File(srtPath);
var item = _fsSubAchaItem(f.fsName, f.name);
if (!item) { 
return _fsJSON.stringify({error: "O item do SRT sumiu do projeto entre as fases."});
}
var antes = 0;
try {
antes = ((seq.captionTracks) && (seq.captionTracks.numTracks)) || (0);
} catch (eT) {
}
var retorno = "";
var erro = "";
try {
retorno = "" + seq.createCaptionTrack(item, 0);
} catch (eC) {erro = eC.toString();
}
if (erro) { 
return _fsJSON.stringify({error: "createCaptionTrack: " + erro, sonda: _fsSondaEscopo()});
}
return _fsJSON.stringify({antes: antes, ok: true, retorno: retorno});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsSubtitulosConta() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequencia ativa."});
}
var n = 0;
try {
n = ((seq.captionTracks) && (seq.captionTracks.numTracks)) || (0);
} catch (eT) {
}
return _fsJSON.stringify({ok: true, trilhas: n});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function saveSrtFile(srtText, defaultName) {
try {
var dn = (defaultName) && ("" + defaultName) ? "" + defaultName : "legendas.srt";
if (!/\.srt$/i.test(dn)) { 
dn = dn + ".srt";
}
var seedDir = (Folder.myDocuments) && (Folder.myDocuments.fsName) ? Folder.myDocuments.fsName : Folder.desktop.fsName;
var seed = new File(seedDir + "/" + dn);
var f = seed.saveDlg("Salvar legendas (SRT)");
if (!f) { 
return _fsJSON.stringify({canceled: true});
}
var p = f.fsName;
if (!/\.srt$/i.test(p)) { 
p = p + ".srt";
f = new File(p);
}
f.encoding = "UTF-8";
f.lineFeed = "Unix";
if (!f.open("w")) { 
return _fsJSON.stringify({error: "Falha ao abrir o arquivo para escrita."});
}
f.write("\ufeff" + srtText);
f.close();
return _fsJSON.stringify({ok: true, path: f.fsName});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsDbParaLevel(db) {
if ((typeof db !== "number") || (isNaN(db))) { 
return null;
}
if (db <= -60) { 
return 0;
}
var v = Math.pow(10, (db - 15) / 20);
if (v > 1) { 
v = 1;
}
return v;
}
function _fsLevelParaDb(v) {
if (((typeof v !== "number") || (isNaN(v))) || (v <= 0)) { 
return -Infinity;
}
return ((Math.log(v) / Math.LN10) * 20) + 15;
}
function _fsNivelDoClipe(clip) {
var comps = null;
try {
comps = clip.components;
} catch (eC) {return null;
}
if (!comps) { 
return null;
}
for (var i = 0; i < comps.numItems; i += 1) { 
var comp = null;
try {
comp = comps[i];
} catch (e1) {continue ;
}
if (!comp) { 
continue ;
}
var cn = "";
try {
cn = String((comp.displayName) || (""));
} catch (e2) {cn = "";
}
if (cn.toLowerCase().indexOf("volume") === -1) { 
continue ;
}
if ((cn.toLowerCase().indexOf("channel") !== -1) || (cn.toLowerCase().indexOf("canal") !== -1)) { 
continue ;
}
var props = null;
try {
props = comp.properties;
} catch (e3) {continue ;
}
if (!props) { 
continue ;
}
for (var j = 0; j < props.numItems; j += 1) { 
var pr = null;
try {
pr = props[j];
} catch (e4) {continue ;
}
if (!pr) { 
continue ;
}
var pn = "";
try {
pn = String((pr.displayName) || (""));
} catch (e5) {pn = "";
}
var sem = _fsSemAcento(pn);
if ((sem.indexOf("level") !== -1) || (sem.indexOf("nivel") !== -1)) { 
return pr;
}}}
return null;
}
function _fsSfxSetLevel(clip, db) {
var alvo = _fsDbParaLevel(db);
if (alvo === null) { 
return {erro: "dB inv\xe1lido", ok: false};
}
var comps = null;
try {
comps = clip.components;
} catch (eC) {return {erro: "sem components", ok: false};
}
if (!comps) { 
return {erro: "sem components", ok: false};
}
var achou = null;
var nomeComp = "";
var nomeProp = "";
for (var i = 0; i < comps.numItems; i += 1) { 
var comp = null;
try {
comp = comps[i];
} catch (e1) {continue ;
}
if (!comp) { 
continue ;
}
var cn = "";
try {
cn = String((comp.displayName) || (""));
} catch (e2) {cn = "";
}
if (cn.toLowerCase().indexOf("volume") === -1) { 
continue ;
}
if ((cn.toLowerCase().indexOf("channel") !== -1) || (cn.toLowerCase().indexOf("canal") !== -1)) { 
continue ;
}
var props = null;
try {
props = comp.properties;
} catch (e3) {continue ;
}
if (!props) { 
continue ;
}
for (var j = 0; j < props.numItems; j += 1) { 
var pr = null;
try {
pr = props[j];
} catch (e4) {continue ;
}
if (!pr) { 
continue ;
}
var pn = "";
try {
pn = String((pr.displayName) || (""));
} catch (e5) {pn = "";
}
var _pnSem = _fsSemAcento(pn);
if ((_pnSem.indexOf("level") !== -1) || (_pnSem.indexOf("nivel") !== -1)) { 
achou = pr;
nomeComp = cn;
nomeProp = pn;
break ;
}}
if (achou) { 
break ;
}}
if (!achou) { 
return {erro: "par\xe2metro de n\xedvel n\xe3o encontrado no clipe", ok: false};
}
var gravou = false;
try {
achou.setValue(alvo, true);
gravou = true;
} catch (eS1) {
}
if (!gravou) { 
try {
achou.setValue(alvo);
gravou = true;
} catch (eS2) {
}
}
if (!gravou) { 
return {comp: nomeComp, erro: "setValue recusado", ok: false, prop: nomeProp};
}
var lido = null;
try {
lido = achou.getValue();
} catch (eG) {
}
if (typeof lido !== "number") { 
return {comp: nomeComp, erro: "n\xe3o consegui ler de volta", escrito: alvo, ok: false, prop: nomeProp};
}
var bateu = Math.abs(lido - alvo) <= Math.max(0.0005, alvo * 0.02);
return {comp: nomeComp, erro: bateu ? "" : "gravou mas voltou diferente", escrito: alvo, lido: lido, lidoDb: _fsLevelParaDb(lido), ok: bateu, prop: nomeProp};
}
function insertSfxAtCTI(sfxAbsPath, sfxDb) {
try {
if ((!sfxAbsPath) || (sfxAbsPath === "")) { 
return _fsJSON.stringify({error: "Caminho do SFX n\xe3o informado"});
}
var sfxNorm = sfxAbsPath.split("\\").join("/");
var sfxFile = new File(sfxNorm);
if (!sfxFile.exists) { 
return _fsJSON.stringify({error: "Arquivo n\xe3o encontrado: " + sfxAbsPath});
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa"});
}
var sfxItem = null;
for (var i = 0; i < app.project.rootItem.children.numItems; i += 1) { 
try {
var child = app.project.rootItem.children[i];
if ((child) && (child.name === sfxFile.displayName)) { 
sfxItem = child;
break ;
}
} catch (e) {
}}
if (!sfxItem) { 
app.project.importFiles([sfxFile.fsName], 1, app.project.rootItem, 0);
for (var j = 0; j < app.project.rootItem.children.numItems; j += 1) { 
try {
var ch = app.project.rootItem.children[j];
if ((ch) && (ch.name === sfxFile.displayName)) { 
sfxItem = ch;
break ;
}
} catch (e) {
}}
}
if (!sfxItem) { 
return _fsJSON.stringify({error: "Falha ao importar SFX"});
}
var ctiTicks = seq.getPlayerPosition().ticks;
var targetTrack = null;
var ctiSec = parseFloat(ctiTicks) / 254016000000;
for (var t = 0; t < seq.audioTracks.numTracks; t += 1) { 
var track = seq.audioTracks[t];
var safe = true;
for (var c = 0; c < track.clips.numItems; c += 1) { 
var clip = track.clips[c];
if (clip.end.seconds > ctiSec) { 
safe = false;
break ;
}}
if (safe) { 
targetTrack = track;
break ;
}}
if (!targetTrack) { 
if (!_fsAddTrilhaAudio(seq)) { 
return _fsJSON.stringify({error: "Nao consegui criar uma trilha de audio pro SFX. Crie uma trilha de audio vazia e tente de novo."});
}
targetTrack = seq.audioTracks[seq.audioTracks.numTracks - 1];
if (!targetTrack) { 
return _fsJSON.stringify({error: "Nao consegui criar uma trilha de audio pro SFX."});
}
}
targetTrack.insertClip(sfxItem, ctiTicks);
var volOk = false;
var volErro = "";
var volDetalhe = null;
var dbPedido = (typeof sfxDb === "number") && (!isNaN(sfxDb)) ? sfxDb : 0;
if (dbPedido !== 0) { 
var novo = null;
var ctiNum = parseFloat(ctiTicks);
for (var k = 0; k < targetTrack.clips.numItems; k += 1) { 
var cand = null;
try {
cand = targetTrack.clips[k];
} catch (eK) {continue ;
}
if (!cand) { 
continue ;
}
var st = null;
try {
st = parseFloat(cand.start.ticks);
} catch (eSt) {continue ;
}
if ((!isNaN(st)) && (Math.abs(st - ctiNum) < 2)) { 
novo = cand;
break ;
}}
if (!novo) { 
volErro = "n\xe3o achei o clipe rec\xe9m-inserido";
}
else {
volDetalhe = _fsSfxSetLevel(novo, dbPedido);
volOk = volDetalhe.ok === true;
volErro = (volDetalhe.erro) || ("");
}
}
return _fsJSON.stringify({name: sfxFile.displayName, ok: true, volume: volDetalhe, volumeErro: volErro, volumeOk: volOk});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsNormCaminho(c) {
return String((c) || ("")).replace(/\\/g, "/").toLowerCase();
}
function _fsAchaAudioPorCaminho(folder, alvoNorm) {
for (var i = 0; i < folder.children.numItems; i += 1) { 
var item = folder.children[i];
if (item.type === ProjectItemType.BIN) { 
var found = _fsAchaAudioPorCaminho(item, alvoNorm);
if (found) { 
return found;
}
}
else {
var mp = "";
try {
if (item.getMediaPath) { 
mp = String(item.getMediaPath());
}
} catch (eMP) {
}
if ((mp) && (_fsNormCaminho(mp) === alvoNorm)) { 
return item;
}
}}
return null;
}
function _fsGravarSlots(mgt, userTexts, fixRuns) {
var placar = {apagados: 0, gravados: 0, reserva: 0};
var props = null;
try {
props = mgt.properties;
} catch (eP) {return placar;
}
if (!props) { 
return placar;
}
var textIndex = 0;
for (var p = 0; p < props.numItems; p += 1) { 
var param = props[p];
try {
var val = param.getValue();
if ((typeof val === "string") && (val.indexOf("textEditValue") !== -1)) { 
try {
var textObj = _fsJSON.parse(val);
if ((textObj) && (textObj.textEditValue !== undefined)) { 
if (textIndex < userTexts.length) { 
textObj.textEditValue = userTexts[textIndex];
placar.gravados++;
}
else {
textObj.textEditValue = "";
placar.apagados++;
}
if (typeof fixRuns === "function") { 
try {
fixRuns(textObj);
} catch (eFix) {
}
}
param.setValue(_fsJSON.stringify(textObj), true);
textIndex++;
}
} catch (parseErr) {
}
}
} catch (errMap) {
}}
if (textIndex === 0) { 
for (var p2 = 0; (p2 < props.numItems) && (textIndex < userTexts.length); p2++) { 
try {
var val2 = props[p2].getValue();
if ((typeof val2 === "string") && (val2.indexOf("textEditValue") === -1)) { 
var pf = parseFloat(val2);
if (((((isNaN(pf)) && (val2.indexOf("#") === -1)) && (val2.indexOf("[") === -1)) && (val2.length > 2)) && (val2.length < 500)) { 
props[p2].setValue(userTexts[textIndex], true);
textIndex++;
placar.reserva++;
}
}
} catch (errMap2) {
}}
}
return placar;
}
function injectMogrtPremiere(jsonStringArgs) {
try {
var args = _fsJSON.parse(jsonStringArgs);
var templateFolder = args.templateFolder;
var mogrtFile = args.aepFile;
var extPath = args.extPath;
var highlightColor = (args.highlightColor) || ("");
var supportColor = (args.supportColor) || ("");
var gradientOn = (args.gradientEnabled === true) || (args.gradientEnabled === "true");
var gradientEndColor = (args.gradientEndColor) || ("");
var gradientSupOn = (args.gradientSupEnabled === true) || (args.gradientSupEnabled === "true");
var gradientSupEndColor = (args.gradientSupEndColor) || ("");
var fontHighlight = ((args.fontHighlight) || (args.fontFamily)) || ("");
var fontSupport = (args.fontSupport) || ("");
var fontHighlightFamily = (args.fontHighlightFamily) || ("");
var fontHighlightStyle = (args.fontHighlightStyle) || ("");
var fontSupportFamily = (args.fontSupportFamily) || ("");
var fontSupportStyle = (args.fontSupportStyle) || ("");
var fontHighlightFamilyPref = (args.fontHighlightFamilyPref) || ("");
var fontSupportFamilyPref = (args.fontSupportFamilyPref) || ("");
var highlightSize = (typeof args.highlightSize === "number") && (args.highlightSize > 0) ? args.highlightSize : 0;
var supportSize = (typeof args.supportSize === "number") && (args.supportSize > 0) ? args.supportSize : 0;
var shadowValue = (typeof args.shadowValue === "number") && (args.shadowValue >= 0) ? args.shadowValue : -1;
var trackingValue = (typeof args.trackingValue === "number") && (args.trackingValue > -201) ? args.trackingValue : -201;
var stylesEnabled = args.stylesEnabled === true;
var fontsEnabled = args.fontsEnabled === true;
var assetFile = ((args.assetFile) && (args.assetFile !== "undefined")) && (args.assetFile !== "null") ? args.assetFile : "";
if ((!mogrtFile) || (mogrtFile === "")) { 
var modelName = templateFolder ? templateFolder.split("/").pop() : "Modelo selecionado";
return "Erro: O " + modelName + " n\xe3o foi encontrado ou foi corrompido.";
}
var fullMogrtPath = mogrtFile;
var isAbsolute = ((fullMogrtPath.indexOf("/") === 0) || (fullMogrtPath.indexOf(":\\") !== -1)) || (fullMogrtPath.indexOf(":/") !== -1);
if (!isAbsolute) { 
fullMogrtPath = extPath + "/templates/" + templateFolder + "/" + mogrtFile;
}
fullMogrtPath = fullMogrtPath.replace(/\\/g, "/");
var mogrtObj = new File(fullMogrtPath);
if (!mogrtObj.exists) { 
var fsmPath = fullMogrtPath.replace(/\.mogrt$/i, ".fsm");
var fsmObjTry = new File(fsmPath);
if (fsmObjTry.exists) { 
mogrtObj = fsmObjTry;
fullMogrtPath = fsmObjTry.fsName;
}
}
if (!mogrtObj.exists) { 
var mDir = mogrtObj.parent;
if ((mDir) && (mDir.exists)) { 
var mFiles = mDir.getFiles("*.fsm");
if ((!mFiles) || (mFiles.length === 0)) { 
mFiles = mDir.getFiles("*.mogrt");
}
if ((mFiles) && (mFiles.length > 0)) { 
mogrtObj = mFiles[0];
fullMogrtPath = mogrtObj.fsName;
}
}
}
if (!mogrtObj.exists) { 
return "Erro: Template n\xe3o encontrado em: " + fullMogrtPath;
}
var tempMogrtPath = "";
var proj = app.project;
if (!proj) { 
return "Erro: Nenhum projeto aberto.";
}
var seq = proj.activeSequence;
if (!seq) { 
return "Erro: Nenhuma sequ\xeancia ativa no Premiere.";
}
var selectedClips = [];
var minStartSeconds = 999999999;
var minStartTicks = (args.preStartTicks) || ("");
var maxEndSeconds = -1;
var maxEndTicks = (args.preEndTicks) || ("");
var maxEndTimeObj = null;
var targetTrackIndex = args.preTrackIndex >= 0 ? args.preTrackIndex : -1;
var preferredTrack = (typeof args.preferredTrack === "number") && (args.preferredTrack >= 0) ? args.preferredTrack : -1;
var scaleMode = (args.scaleMode) || ("auto");
var isFromCaption = args.preIsFromCaption === true;
var hasPreTiming = (minStartTicks !== "") && (maxEndTicks !== "");
var isBatch = args.isBatch === true;
_fsUltimoMogrt = null;
_fsFonteTentada = "";
_fsFonteProp = "";
if (isFromCaption) { 
var captionTrack = null;
try {
captionTrack = seq.captionTrack;
} catch (ec) {
}
if (captionTrack) { 
var cclips = captionTrack.clips;
if (hasPreTiming) { 
var minSec = parseFloat(minStartTicks) / 254016000000;
var maxSec = parseFloat(maxEndTicks) / 254016000000;
for (var cj = 0; cj < cclips.numItems; cj += 1) { 
var c = cclips[cj];
if ((c.start.seconds < maxSec) && (c.end.seconds > minSec)) { 
if (!isBatch) { 
selectedClips.push(c);
}
}}
}
else {
for (var cj = 0; cj < cclips.numItems; cj += 1) { 
var c = cclips[cj];
var isSel = false;
try {
isSel = c.isSelected();
} catch (es) {
}
if (isSel) { 
selectedClips.push(c);
if (c.start.seconds < minStartSeconds) { 
minStartSeconds = c.start.seconds;
minStartTicks = c.start.ticks;
}
if (c.end.seconds > maxEndSeconds) { 
maxEndSeconds = c.end.seconds;
maxEndTicks = c.end.ticks;
maxEndTimeObj = c.end;
}
}}
}
}
if ((targetTrackIndex === null) || (targetTrackIndex < 0)) { 
targetTrackIndex = seq.videoTracks.numTracks > 0 ? seq.videoTracks.numTracks - 1 : 0;
}
}
else {
var videoTracks = seq.videoTracks;
for (var i = 0; i < videoTracks.numTracks; i += 1) { 
var track = videoTracks[i];
var clips = track.clips;
for (var j = 0; j < clips.numItems; j += 1) { 
var clip = clips[j];
var isSel = false;
try {
isSel = clip.isSelected();
} catch (es) {
}
if (isSel) { 
if (!isBatch) { 
selectedClips.push(clip);
if (targetTrackIndex === -1) { 
targetTrackIndex = i;
}
}
if (!hasPreTiming) { 
if (clip.start.seconds < minStartSeconds) { 
minStartSeconds = clip.start.seconds;
minStartTicks = clip.start.ticks;
}
if (clip.end.seconds > maxEndSeconds) { 
maxEndSeconds = clip.end.seconds;
maxEndTicks = clip.end.ticks;
maxEndTimeObj = clip.end;
}
}
}}}
if (((hasPreTiming) && (selectedClips.length === 0)) && (!isBatch)) { 
var minSec = parseFloat(minStartTicks) / 254016000000;
var maxSec = parseFloat(maxEndTicks) / 254016000000;
for (var vi = 0; vi < videoTracks.numTracks; vi += 1) { 
var vclips = videoTracks[vi].clips;
for (var vj = 0; vj < vclips.numItems; vj += 1) { 
var vc = vclips[vj];
if ((vc.start.seconds < maxSec) && (vc.end.seconds > minSec)) { 
selectedClips.push(vc);
if (targetTrackIndex < 0) { 
targetTrackIndex = vi;
}
}}}
if (targetTrackIndex < 0) { 
targetTrackIndex = 0;
}
}
}
if ((!hasPreTiming) && (selectedClips.length < 1)) { 
return "Erro: Selecione pelo menos 1 clipe de legenda ou texto na timeline.";
}
if (targetTrackIndex < 0) { 
targetTrackIndex = 0;
}
var fsPath = mogrtObj.fsName;
var userTexts = (args.userTexts) || ([]);
if (userTexts.length === 0) { 
try {
var captionTrack = seq.captionTrack;
if (captionTrack) { 
var captionItems = captionTrack.clips;
var minSec = minStartSeconds;
var maxSec = maxEndSeconds;
for (var ci = 0; ci < captionItems.numItems; ci += 1) { 
var cpClip = captionItems[ci];
if ((cpClip.start.seconds < maxSec) && (cpClip.end.seconds > minSec)) { 
try {
var txt = "";
try {
txt = cpClip.caption.getText();
} catch (e1) {
}
if (!txt) { 
try {
txt = cpClip.name;
} catch (e2) {
}
}
if (((txt) && (txt !== "")) && (txt !== "Graphic")) { 
userTexts.push(txt);
}
} catch (ec) {
}
}}
}
} catch (ect) {
}
}
var newMogrtClip = null;
var safeTrackIndex = -1;
var rawStart = (minStartTicks) && (minStartTicks !== "") ? minStartTicks : seq.getPlayerPosition().ticks;
var ticksStr = String(rawStart);
var stSec = parseFloat(rawStart) / 254016000000;
var enSec = (maxEndTicks) && (maxEndTicks !== "") ? parseFloat(maxEndTicks) / 254016000000 : stSec + 3;
var segmentDuration = enSec - stSec;
var endSearchSec = enSec + 1;
var scanEndSec = enSec + 8;
var keepCaptionsEarly = args.keepCaptions === true;
var highestSelectedTrack = targetTrackIndex;
if ((keepCaptionsEarly) && (selectedClips.length > 0)) { 
for (var _hst = 0; _hst < seq.videoTracks.numTracks; _hst += 1) { 
var _hstClips = seq.videoTracks[_hst].clips;
for (var _hsc = 0; _hsc < _hstClips.numItems; _hsc += 1) { 
for (var _hsi = 0; _hsi < selectedClips.length; _hsi += 1) { 
try {
if ((_hstClips[_hsc].start.ticks === selectedClips[_hsi].start.ticks) && (_hstClips[_hsc].end.ticks === selectedClips[_hsi].end.ticks)) { 
if (_hst > highestSelectedTrack) { 
highestSelectedTrack = _hst;
}
}
} catch (_ehs) {
}}}}
}
var startIndex = (((selectedClips.length > 0) || (hasPreTiming)) && (highestSelectedTrack >= 0)) && (highestSelectedTrack < seq.videoTracks.numTracks) ? highestSelectedTrack : 0;
if ((keepCaptionsEarly) && (startIndex < (seq.videoTracks.numTracks - 1))) { 
startIndex = startIndex + 1;
}
if ((preferredTrack >= 0) && (preferredTrack < seq.videoTracks.numTracks)) { 
startIndex = preferredTrack;
var _ptLocked = false;
try {
_ptLocked = seq.videoTracks[preferredTrack].isLocked();
} catch (ePL) {
}
if (!_ptLocked) { 
safeTrackIndex = preferredTrack;
}
}
for (var t = startIndex; (safeTrackIndex === -1) && (t < seq.videoTracks.numTracks); t++) { 
var track = seq.videoTracks[t];
var locked = false;
try {
locked = track.isLocked();
} catch (el) {
}
if (locked) { 
continue ;
}
var isSafe = true;
for (var c = 0; c < track.clips.numItems; c += 1) { 
var cClip = track.clips[c];
try {
if ((cClip.start.seconds < scanEndSec) && (cClip.end.seconds > stSec)) { 
var isSelectedToReplace = false;
for (var sc = 0; sc < selectedClips.length; sc += 1) { 
try {
if (((selectedClips[sc].start.ticks === cClip.start.ticks) && (selectedClips[sc].end.ticks === cClip.end.ticks)) && (selectedClips[sc].name === cClip.name)) { 
isSelectedToReplace = true;
break ;
}
} catch (eMatch) {try {
if ((Math.abs(selectedClips[sc].start.seconds - cClip.start.seconds) < 0.1) && (Math.abs(selectedClips[sc].end.seconds - cClip.end.seconds) < 0.1)) { 
isSelectedToReplace = true;
break ;
}
} catch (eFallback) {
}
}}
if (!isSelectedToReplace) { 
isSafe = false;
break ;
}
}
} catch (eClipError) {isSafe = false;
break ;
}}
if (isSafe) { 
safeTrackIndex = t;
break ;
}}
if (safeTrackIndex === -1) { 
if (startIndex > 0) { 
for (var tf0 = startIndex - 1; tf0 >= 0; tf0 -= 1) { 
var tf0Track = seq.videoTracks[tf0];
var tf0Locked = false;
try {
tf0Locked = tf0Track.isLocked();
} catch (etfl0) {
}
if (tf0Locked) { 
continue ;
}
var tf0Safe = true;
for (var tf0c = 0; tf0c < tf0Track.clips.numItems; tf0c += 1) { 
var tf0Clip = tf0Track.clips[tf0c];
try {
if ((tf0Clip.start.seconds < scanEndSec) && (tf0Clip.end.seconds > stSec)) { 
tf0Safe = false;
break ;
}
} catch (etf0c) {tf0Safe = false;
break ;
}}
if (tf0Safe) { 
safeTrackIndex = tf0;
break ;
}}
}
if (safeTrackIndex === -1) { 
var tracksBefore = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
if (seq.videoTracks.numTracks > tracksBefore) { 
safeTrackIndex = seq.videoTracks.numTracks - 1;
}
}
if (safeTrackIndex === -1) { 
for (var tf = 0; tf < seq.videoTracks.numTracks; tf += 1) { 
var tfTrack = seq.videoTracks[tf];
var tfLocked = false;
try {
tfLocked = tfTrack.isLocked();
} catch (etfl) {
}
if (tfLocked) { 
continue ;
}
var tfSafe = true;
for (var tfc = 0; tfc < tfTrack.clips.numItems; tfc += 1) { 
var tfClip = tfTrack.clips[tfc];
try {
if ((tfClip.start.seconds < scanEndSec) && (tfClip.end.seconds > stSec)) { 
var tfSel = false;
for (var tfsc = 0; tfsc < selectedClips.length; tfsc += 1) { 
try {
if (((selectedClips[tfsc].start.ticks === tfClip.start.ticks) && (selectedClips[tfsc].end.ticks === tfClip.end.ticks)) && (selectedClips[tfsc].name === tfClip.name)) { 
tfSel = true;
break ;
}
} catch (etfm) {try {
if ((Math.abs(selectedClips[tfsc].start.seconds - tfClip.start.seconds) < 0.1) && (Math.abs(selectedClips[tfsc].end.seconds - tfClip.end.seconds) < 0.1)) { 
tfSel = true;
break ;
}
} catch (etff) {
}
}}
if (!tfSel) { 
tfSafe = false;
break ;
}
}
} catch (etfc) {tfSafe = false;
break ;
}}
if (tfSafe) { 
safeTrackIndex = tf;
break ;
}}
}
if (safeTrackIndex === -1) { 
if (_fsAddTrilhaVideo(seq)) { 
safeTrackIndex = seq.videoTracks.numTracks - 1;
}
}
if (safeTrackIndex === -1) { 
return "TIMELINE_PROTECTION_ERROR";
}
}
var keepCaptions = args.keepCaptions === true;
var kcReposition = (keepCaptions) && (preferredTrack < 0);
var kcBaseTrack = highestSelectedTrack >= 0 ? highestSelectedTrack : -1;
if (((kcReposition) && (kcBaseTrack < 0)) && (isBatch)) { 
try {
for (var _kbt = 0; _kbt < seq.videoTracks.numTracks; _kbt += 1) { 
var _kbtClips = seq.videoTracks[_kbt].clips;
for (var _kbc = 0; _kbc < _kbtClips.numItems; _kbc += 1) { 
try {
var _kbClip = _kbtClips[_kbc];
if ((_kbClip.start.seconds < enSec) && (_kbClip.end.seconds > stSec)) { 
if (_kbt > kcBaseTrack) { 
kcBaseTrack = _kbt;
}
}
} catch (_kbe) {
}}}
} catch (_kbtE) {
}
if (kcBaseTrack < 0) { 
kcBaseTrack = 0;
}
}
if ((kcReposition) && (kcBaseTrack >= 0)) { 
var kcSafeIndex = -1;
for (var kct = kcBaseTrack + 1; kct < seq.videoTracks.numTracks; kct += 1) { 
var kcTrack = seq.videoTracks[kct];
var kcLocked = false;
try {
kcLocked = kcTrack.isLocked();
} catch (eLk) {
}
if (kcLocked) { 
continue ;
}
var kcSafe = true;
for (var kcc = 0; kcc < kcTrack.clips.numItems; kcc += 1) { 
var kcClip = kcTrack.clips[kcc];
try {
if ((kcClip.start.seconds < enSec) && (kcClip.end.seconds > stSec)) { 
kcSafe = false;
break ;
}
} catch (eKcc) {kcSafe = false;
break ;
}}
if (kcSafe) { 
kcSafeIndex = kct;
break ;
}}
if (kcSafeIndex === -1) { 
if (_fsAddTrilhaVideo(seq)) { 
kcSafeIndex = seq.videoTracks.numTracks - 1;
}
}
if ((kcSafeIndex === -1) && (kcBaseTrack > 0)) { 
for (var kcd = kcBaseTrack - 1; kcd >= 0; kcd -= 1) { 
var kcdTrack = seq.videoTracks[kcd];
var kcdLocked = false;
try {
kcdLocked = kcdTrack.isLocked();
} catch (eKcdL) {
}
if (kcdLocked) { 
continue ;
}
var kcdSafe = true;
for (var kcdC = 0; kcdC < kcdTrack.clips.numItems; kcdC += 1) { 
try {
var kcdClip = kcdTrack.clips[kcdC];
if ((kcdClip.start.seconds < enSec) && (kcdClip.end.seconds > stSec)) { 
kcdSafe = false;
break ;
}
} catch (eKcdC) {kcdSafe = false;
break ;
}}
if (kcdSafe) { 
kcSafeIndex = kcd;
break ;
}}
}
if (kcSafeIndex === -1) { 
if (_fsAddTrilhaVideo(seq)) { 
kcSafeIndex = seq.videoTracks.numTracks - 1;
}
else {
kcSafeIndex = safeTrackIndex;
}
}
if (kcSafeIndex >= 0) { 
safeTrackIndex = kcSafeIndex;
}
}
if ((!keepCaptions) && (!isBatch)) { 
for (var c = 0; c < selectedClips.length; c += 1) { 
try {
selectedClips[c].remove(false, false);
} catch (E) {
}}
}
try {
newMogrtClip = seq.importMGT(fullMogrtPath, ticksStr, safeTrackIndex, 0);
} catch (emgt) {
}
if (!newMogrtClip) { 
return "Erro Prote\xe7\xe3o: Falha ao importar o MOGRT na trilha V" + safeTrackIndex + 1 + ".\n\nIMPORTANTE: Verifique se voc\xea adicionou pelo menos uma propriedade (ex: Texto) ao painel \'Essential Graphics\' no After Effects antes de salvar o modelo.";
}
try {
_fsUltimoMogrt = {inicio: newMogrtClip.start.ticks, trilha: safeTrackIndex};
} catch (eUm) {
}
if (newMogrtClip) { 
function _fsFixRuns(o) {
if (((!o) || (!o.fontTextRunLength)) || (!o.fontTextRunLength.length)) { 
return;
}
var n = typeof o.textEditValue === "string" ? o.textEditValue.length : 0;
var arr = o.fontTextRunLength;
var sum = 0;
for (var _ri = 0; _ri < arr.length; _ri += 1) { 
sum += arr[_ri];}
if (sum === n) { 
return;
}
var acc = 0;
for (var _rj = 0; _rj < arr.length; _rj += 1) { 
var remaining = n - acc;
if (remaining <= 0) { 
arr[_rj] = 0;
continue ;
}
if (arr[_rj] > remaining) { 
arr[_rj] = remaining;
}
acc += arr[_rj];}
if (acc < n) { 
arr[arr.length - 1] += (n - acc);
}
}
if (((args.audioEnabled) && (assetFile !== "")) && (assetFile !== "null")) { 
try {
var isAudio = /\.(mp3|wav|m4a|aac|aif|aiff)$/i.test(assetFile);
if (isAudio) { 
var assetPath = (args.fullAssetPath) && (args.fullAssetPath !== "") ? args.fullAssetPath : extPath + "/templates/" + (templateFolder) || ("") + "/" + assetFile;
assetPath = assetPath.replace(/\\/g, "/");
var assetFileObj = new File(assetPath);
if (assetFileObj.exists) { 
function findItemRecursiveAudio(folder, targetFull, targetNoExt) {
for (var i = 0; i < folder.children.numItems; i += 1) { 
var item = folder.children[i];
if (item.type === ProjectItemType.BIN) { 
var found = findItemRecursiveAudio(item, targetFull, targetNoExt);
if (found) { 
return found;
}
}
else {
if ((item.name === targetFull) || (item.name === targetNoExt)) { 
return item;
}
}}
return null;
}
var audioItem = null;
var nameNoExt = assetFile.split(".");
if (nameNoExt.length > 1) { 
nameNoExt.pop();
}
nameNoExt = nameNoExt.join(".");
audioItem = _fsAchaAudioPorCaminho(app.project.rootItem, _fsNormCaminho(assetFileObj.fsName));
if (!audioItem) { 
try {
app.project.importFiles([assetFileObj.fsName], 1, (app.project.getInsertionBin()) || (app.project.rootItem), 0);
} catch (eImport) {
}
audioItem = _fsAchaAudioPorCaminho(app.project.rootItem, _fsNormCaminho(assetFileObj.fsName));
if (!audioItem) { 
audioItem = findItemRecursiveAudio(app.project.rootItem, assetFile, nameNoExt);
}
}
if (audioItem) { 
var startSeconds = parseFloat(ticksStr) / 254016000000;
var audioTrackIndex = _findBestAudioTrackForTime(seq, startSeconds);
if (audioTrackIndex < seq.audioTracks.numTracks) { 
seq.audioTracks[audioTrackIndex].overwriteClip(audioItem, ticksStr);
}
}
}
}
} catch (eAudio) {
}
}
var mgt = null;
try {
mgt = newMogrtClip.getMGTComponent();
} catch (mgtErr) {
}
if (((mgt) && (userTexts)) && (userTexts.length > 0)) { 
_fsGravarSlots(mgt, userTexts, _fsFixRuns);
}
if ((mgt) && ((stylesEnabled) || (fontsEnabled))) { 
try {
function _getGroupIndex(groupName) {
var n = groupName.toLowerCase();
if (((n.indexOf("principal") !== -1) || (n.indexOf("destaque") !== -1)) || (n.indexOf("highlight") !== -1)) { 
return 0;
}
if (((n.indexOf("secundar") !== -1) || (n.indexOf("apoio") !== -1)) || (n.indexOf("support") !== -1)) { 
return 1;
}
var m = n.match(/text(?:o)?\s*(\d+)/i);
if (m) { 
var num = parseInt(m[1], 10);
return num === 1 ? 0 : 1;
}
return -1;
}
var maxFs = 0;
var minFs = 0;
var sectionFontSizes = {};
var _curScanSec = "";
var scanForMaxFs = function (props) {
for (var i = 0; i < props.numItems; i += 1) { 
var p = props[i];
if (!p) { 
continue ;
}
if (p.numItems > 0) { 
scanForMaxFs(p);
continue ;
}
try {
var v = p.getValue();
var _spn = "";
try {
_spn = (p.displayName) || ("").toLowerCase();
} catch (e) {
}
if ((typeof v === "string") && (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(v))) { 
_curScanSec = _spn;
if (typeof sectionFontSizes[_spn] === "undefined") { 
sectionFontSizes[_spn] = 0;
}
}
if ((typeof v === "string") && (v.indexOf("fontSizeEditValue") !== -1)) { 
var obj = _fsJSON.parse(v);
if ((obj) && (obj.fontSizeEditValue)) { 
for (var f = 0; f < obj.fontSizeEditValue.length; f += 1) { 
var _fs = obj.fontSizeEditValue[f];
if (_fs > maxFs) { 
maxFs = _fs;
}
if ((_fs > 0) && ((minFs === 0) || (_fs < minFs))) { 
minFs = _fs;
}
if ((_curScanSec) && (_fs > (sectionFontSizes[_curScanSec]) || (0))) { 
sectionFontSizes[_curScanSec] = _fs;
}}
}
}
} catch (e) {
}}
};
scanForMaxFs(mgt.properties);
var _tamDecide = ((maxFs > 0) && (minFs > 0)) && ((maxFs - minFs) > 0.1);
var principalSectionPName = "";
var _maxSecFs = 0;
for (var _sn in sectionFontSizes) { 
if (sectionFontSizes[_sn] > _maxSecFs) { 
_maxSecFs = sectionFontSizes[_sn];
principalSectionPName = _sn;
}
}
var textFormatIndex = 0;
var currentColorSection = -1;
var soloSecundaria = !(!args.soloUsaSecundaria);
var processMgtProps = function (props, inheritedGroupIndex) {
inheritedGroupIndex = typeof inheritedGroupIndex === "number" ? inheritedGroupIndex : -1;
for (var px = 0; px < props.numItems; px += 1) { 
try {
var param2 = props[px];
if (!param2) { 
continue ;
}
if (param2.numItems > 0) { 
var gName = "";
try {
gName = (param2.displayName) || ("");
} catch (eg) {
}
var _gLow = gName.toLowerCase();
var _isDecoGrp = (((((((_gLow.indexOf("shadow") !== -1) || (_gLow.indexOf("sombra") !== -1)) || (_gLow.indexOf("drop") !== -1)) || (_gLow.indexOf("stroke") !== -1)) || (_gLow.indexOf("glow") !== -1)) || (_gLow.indexOf("outline") !== -1)) || (_gLow.indexOf("contorno") !== -1)) || (_gLow.indexOf("borda") !== -1);
if (_isDecoGrp) { 
processMgtProps(param2, -2);
continue ;
}
var gIdx = _getGroupIndex(gName);
if ((soloSecundaria) && (gIdx === 0)) { 
gIdx = 1;
}
if ((principalSectionPName !== "") && (gIdx >= 0)) { 
var _gNameLow = gName.toLowerCase();
var _tMatch = _gNameLow.match(/text(?:o)?\s*(\d+)/);
if (_tMatch) { 
var _tSec = "text " + parseInt(_tMatch[1], 10);
gIdx = _tSec === principalSectionPName ? 0 : 1;
if ((soloSecundaria) && (gIdx === 0)) { 
gIdx = 1;
}
}
}
if (gIdx < 0) { 
gIdx = inheritedGroupIndex;
}
processMgtProps(param2, gIdx);
continue ;
}
try {
val2 = param2.getValue();
} catch (egv) {continue ;
}
var pName2 = "";
try {
pName2 = param2.displayName.toLowerCase();
} catch (en) {
}
if ((typeof val2 === "string") && (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(val2))) { 
var _isTextSec = /^text(?:o)?\s*\d+$/i.test(pName2);
var _isNamedSec = (((((pName2 === "principal") || (pName2 === "destaque")) || (pName2 === "highlight")) || (pName2.indexOf("secundar") !== -1)) || (pName2 === "apoio")) || (pName2 === "support");
var _isDecoSec = (((pName2 === "drop shadow") || (pName2 === "sombra")) || (/^drop\s*shadow/i.test(pName2))) || (/^sombra/i.test(pName2));
if (((_isTextSec) || (_isNamedSec)) || (_isDecoSec)) { 
lastFontIsHighlight = null;
if (_isDecoSec) { 
currentColorSection = -2;
}
else if ((principalSectionPName !== "") && (pName2 === principalSectionPName)) {
currentColorSection = 0;
}
else if (principalSectionPName !== "") {
currentColorSection = 1;
}
else {
currentColorSection = _getGroupIndex(pName2);
}
if ((soloSecundaria) && (currentColorSection === 0)) { 
currentColorSection = 1;
}
}
}
var anySizeSet = (highlightSize > 0) || (supportSize > 0);
var anyFontSet = (fontsEnabled) && (((fontHighlight !== "") || (fontSupport !== "")) || (anySizeSet));
if (anyFontSet) { 
var isFontSourceText = (typeof val2 === "string") && (val2.indexOf("fontEditValue") !== -1);
var _isSizeKeyword = ((pName2.indexOf("size") !== -1) || (pName2.indexOf("tamanho") !== -1)) || (pName2 === "pt");
var isStandaloneFont = (((pName2.indexOf("font") !== -1) && (!_isSizeKeyword)) || ((pName2.indexOf("fonte") !== -1) && (!_isSizeKeyword))) || (pName2.indexOf("family") !== -1);
if ((isFontSourceText) || (isStandaloneFont)) { 
try {
var groupIdentified = inheritedGroupIndex >= 0;
var textIsHighlight = groupIdentified ? inheritedGroupIndex === 0 : textFormatIndex === 0;
if (soloSecundaria) { 
textIsHighlight = false;
}
try {
var foundColorInGroup = false;
var detectedWhite = false;
for (var cx = 0; cx < props.numItems; cx += 1) { 
var cParam = props[cx];
if (cParam) { 
var cName = "";
try {
cName = cParam.displayName.toLowerCase();
} catch (e) {
}
var isFillColor = ((cName.indexOf("cor") !== -1) || (cName.indexOf("color") !== -1)) || (cName.indexOf("colour") !== -1);
var isDecoration = (((((((((cName.indexOf("fundo") !== -1) || (cName.indexOf("bg") !== -1)) || (cName.indexOf("caixa") !== -1)) || (cName.indexOf("box") !== -1)) || (cName.indexOf("sombra") !== -1)) || (cName.indexOf("shadow") !== -1)) || (cName.indexOf("contorno") !== -1)) || (cName.indexOf("stroke") !== -1)) || (cName.indexOf("borda") !== -1)) || (cName.indexOf("border") !== -1);
if ((isFillColor) && (!isDecoration)) { 
var cValFont = typeof cParam.getColorValue === "function" ? cParam.getColorValue() : cParam.getValue();
if (typeof cValFont === "string") { 
if (cValFont.indexOf("#") !== -1) { 
var h = cValFont.replace(/[^a-f0-9]/gi, "").toLowerCase();
if (((parseInt(h.substring(0, 2), 16) >= 240) && (parseInt(h.substring(2, 4), 16) >= 240)) && (parseInt(h.substring(4, 6), 16) >= 240)) { 
detectedWhite = true;
foundColorInGroup = true;
break ;
}
}
}
else {
if (((typeof cValFont === "object") && (cValFont !== null)) && (cValFont.length >= 3)) { 
var thr = cValFont[0] > 1 ? 240 : 0.94;
if (((cValFont[0] >= thr) && (cValFont[1] >= thr)) && (cValFont[2] >= thr)) { 
detectedWhite = true;
foundColorInGroup = true;
break ;
}
}
}
}
}}
var lowName = pName2.toLowerCase();
var currentFs = 0;
try {
var fsObj = _fsJSON.parse(val2);
if (((fsObj) && (fsObj.fontSizeEditValue)) && (fsObj.fontSizeEditValue.length > 0)) { 
currentFs = fsObj.fontSizeEditValue[0];
}
} catch (efs) {
}
if (((_tamDecide) && (currentFs > 0)) && (Math.abs(currentFs - maxFs) < 0.1)) { 
textIsHighlight = true;
}
else if (((_tamDecide) && (currentFs > 0)) && (currentFs < (maxFs - 1))) {
textIsHighlight = false;
}
else {
if (!groupIdentified) { 
if (((lowName.indexOf("destaque") !== -1) || (lowName.indexOf("colorido") !== -1)) || (lowName.indexOf("bold") !== -1)) { 
textIsHighlight = true;
}
else if (((lowName.indexOf("apoio") !== -1) || (lowName.indexOf("fino") !== -1)) || (lowName.indexOf("branco") !== -1)) {
textIsHighlight = false;
}
else if (foundColorInGroup) {
textIsHighlight = textFormatIndex === 0 ? true : !detectedWhite;
}
else {
textIsHighlight = (textFormatIndex === 0) && (!/\btexto [2-9]\b/.test(lowName));
}
}
}
} catch (eIsHL) {
}
if (soloSecundaria) { 
textIsHighlight = false;
}
var selectedFont = textIsHighlight ? fontHighlight : fontSupport;
if (selectedFont === "") { 
selectedFont = textIsHighlight ? fontSupport : fontHighlight;
}
if (selectedFont !== "") { 
var _usedHl = textIsHighlight;
var _prefFam = _usedHl ? fontHighlightFamilyPref : fontSupportFamilyPref;
var _nameID1 = _usedHl ? fontHighlightFamily : fontSupportFamily;
var _nameID2 = _usedHl ? fontHighlightStyle : fontSupportStyle;
var familyName = ((_prefFam) || (_nameID1)) || ("");
var styleName = "";
if (((_prefFam) && (_nameID1)) && (_nameID1.indexOf(_prefFam) === 0)) { 
styleName = _nameID1.slice(_prefFam.length).replace(/^\s+|\s+$/g, "");
}
if (!styleName) { 
styleName = (_nameID2) || ("");
}
if (((!_prefFam) && ((styleName === "Regular") || (styleName === ""))) && (_nameID1)) { 
var _knownSfx = ["Bold Italic", "Bold", "SemiBold Italic", "SemiBold", "Medium Italic", "Medium", "Light Italic", "Light", "Thin Italic", "Thin", "Black Italic", "Black", "Heavy Italic", "Heavy", "ExtraBold Italic", "ExtraBold", "ExtraLight Italic", "ExtraLight", "Italic"];
for (var _ki = 0; _ki < _knownSfx.length; _ki += 1) { 
var _ks = _knownSfx[_ki];
if ((_nameID1.length > (_ks.length + 1)) && (_nameID1.slice(-_ks.length).toLowerCase() === _ks.toLowerCase())) { 
familyName = _nameID1.slice(0, _nameID1.length - _ks.length).replace(/\s+$/, "");
styleName = _ks;
break ;
}}
}
if (!familyName) { 
familyName = selectedFont;
styleName = "Regular";
if (selectedFont.indexOf("-") !== -1) { 
var _psParts = selectedFont.split("-");
familyName = _psParts[0];
styleName = _psParts.slice(1).join(" ");
}
else {
var _psStyles = ["BoldItalic", "Bold", "SemiBoldItalic", "SemiBold", "MediumItalic", "Medium", "LightItalic", "Light", "ThinItalic", "Thin", "BlackItalic", "Black", "HeavyItalic", "Heavy", "ExtraLightItalic", "ExtraLight", "ExtraBoldItalic", "ExtraBold", "Italic", "Regular"];
for (var _psi = 0; _psi < _psStyles.length; _psi += 1) { 
var _psSuf = _psStyles[_psi];
if ((selectedFont.length > _psSuf.length) && (selectedFont.slice(-_psSuf.length) === _psSuf)) { 
familyName = selectedFont.slice(0, -_psSuf.length).replace(/\s+$/, "");
styleName = _psSuf;
break ;
}}
}
}
if (isFontSourceText) { 
var fontObj = _fsJSON.parse(val2);
var changedFont = false;
var _runCount = 1;
if (fontObj.fontEditValue) { 
_runCount = fontObj.fontEditValue.length;
var _psNorm = selectedFont.indexOf(" ") !== -1 ? selectedFont.replace(/\s+/g, "-") : selectedFont;
if (_fsFonteTentada === "") { 
_fsFonteTentada = _psNorm;
_fsFonteProp = String(pName2);
}
for (var fi = 0; fi < _runCount; fi += 1) { 
fontObj.fontEditValue[fi] = _psNorm;}
changedFont = true;
}
if ((!fontObj.fontFamilyName) || (fontObj.fontFamilyName.length === 0)) { 
fontObj.fontFamilyName = [];
for (var _fni = 0; _fni < _runCount; _fni += 1) { 
fontObj.fontFamilyName.push(familyName);}
}
else {
for (var fj = 0; fj < fontObj.fontFamilyName.length; fj += 1) { 
fontObj.fontFamilyName[fj] = familyName;}
}
changedFont = true;
if ((!fontObj.fontStyleName) || (fontObj.fontStyleName.length === 0)) { 
fontObj.fontStyleName = [];
for (var _fsi = 0; _fsi < _runCount; _fsi += 1) { 
fontObj.fontStyleName.push(styleName);}
}
else {
for (var fk = 0; fk < fontObj.fontStyleName.length; fk += 1) { 
fontObj.fontStyleName[fk] = styleName;}
}
changedFont = true;
var _newSize = textIsHighlight ? highlightSize : supportSize;
if (((_newSize > 0) && (fontObj.fontSizeEditValue)) && (fontObj.fontSizeEditValue.length > 0)) { 
for (var _fsi2 = 0; _fsi2 < fontObj.fontSizeEditValue.length; _fsi2 += 1) { 
fontObj.fontSizeEditValue[_fsi2] = _newSize;}
changedFont = true;
}
if ((fontObj.fontTextRunLength) && (fontObj.fontTextRunLength.length > 0)) { 
_fsFixRuns(fontObj);
changedFont = true;
}
var fixFaux = ["fontFSBoldValue", "fontFSItalicValue", "fontFauxBoldEditValue", "fontFauxItalicEditValue"];
for (var fx = 0; fx < fixFaux.length; fx += 1) { 
var _fKey = fixFaux[fx];
if ((fontObj[_fKey]) && (fontObj[_fKey].length)) { 
for (var v = 0; v < fontObj[_fKey].length; v += 1) { 
fontObj[_fKey][v] = false;}
changedFont = true;
}}
if (changedFont) { 
try {
param2.setValue(_fsJSON.stringify(fontObj), true);
} catch (_rbe) {
}
}
textFormatIndex++;
}
else {
if (_fsFonteTentada === "") { 
_fsFonteTentada = selectedFont;
_fsFonteProp = String(pName2);
}
param2.setValue(selectedFont, true);
}
}
else {
if ((anySizeSet) && (isFontSourceText)) { 
var _soObj = _fsJSON.parse(val2);
var _soSize = textIsHighlight ? highlightSize : supportSize;
if (((_soSize > 0) && (_soObj.fontSizeEditValue)) && (_soObj.fontSizeEditValue.length > 0)) { 
for (var _soi = 0; _soi < _soObj.fontSizeEditValue.length; _soi += 1) { 
_soObj.fontSizeEditValue[_soi] = _soSize;}
try {
param2.setValue(_fsJSON.stringify(_soObj), true);
} catch (_soe) {
}
}
textFormatIndex++;
}
}
} catch (efj) {
}
}
}
if ((stylesEnabled) && ((highlightColor !== "") || (supportColor !== ""))) { 
var isColorProp = ((pName2.indexOf("cor") !== -1) || (pName2.indexOf("color") !== -1)) || (pName2.indexOf("colour") !== -1);
var isDecorProp = ((((((((((((pName2.indexOf("shadow") !== -1) || (pName2.indexOf("sombra") !== -1)) || (pName2.indexOf("drop") !== -1)) || (pName2.indexOf("stroke") !== -1)) || (pName2.indexOf("contorno") !== -1)) || (pName2.indexOf("borda") !== -1)) || (pName2.indexOf("border") !== -1)) || (pName2.indexOf("outline") !== -1)) || (pName2.indexOf("glow") !== -1)) || (pName2.indexOf("inner") !== -1)) || (pName2.indexOf("fundo") !== -1)) || (pName2.indexOf("back") !== -1)) || (pName2.indexOf("bg") !== -1);
var isUuidValue = (typeof val2 === "string") && (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(val2));
if ((((isColorProp) && (!isDecorProp)) && (!isUuidValue)) && (inheritedGroupIndex !== -2)) { 
var textGroupForColor = inheritedGroupIndex;
if (textGroupForColor < 0) { 
var colorNameMatch = pName2.match(/texto\s*(\d+)|text\s*(\d+)|(\d+)\s*$/);
if (colorNameMatch) { 
var gNum = parseInt(((colorNameMatch[1]) || (colorNameMatch[2])) || (colorNameMatch[3]), 10);
if (principalSectionPName !== "") { 
var secKey = "text " + gNum;
textGroupForColor = secKey === principalSectionPName ? 0 : 1;
}
else {
textGroupForColor = gNum === 1 ? 0 : 1;
}
}
}
if (soloSecundaria) { 
textGroupForColor = 1;
}
var targetColorHex = "";
if ((textGroupForColor === 0) && (highlightColor !== "")) { 
targetColorHex = highlightColor;
}
else if ((textGroupForColor >= 1) && (supportColor !== "")) {
targetColorHex = supportColor;
}
else {
if (textGroupForColor < 0) { 
if ((currentColorSection === 0) && (highlightColor !== "")) { 
targetColorHex = highlightColor;
}
else if ((currentColorSection >= 1) && (supportColor !== "")) {
targetColorHex = supportColor;
}
else {
if (currentColorSection !== -2) { 
if ((textFormatIndex <= 1) && (highlightColor !== "")) { 
targetColorHex = highlightColor;
}
else {
if ((textFormatIndex > 1) && (supportColor !== "")) { 
targetColorHex = supportColor;
}
}
}
}
}
}
var _gLowName = (pName2) || ("").toLowerCase();
if ((_gLowName.indexOf("gradient") !== -1) && ((_gLowName.indexOf("end") !== -1) || (_gLowName.indexOf("final") !== -1))) { 
var _ehSup = false;
if (textGroupForColor >= 1) { 
_ehSup = true;
}
else {
if (textGroupForColor < 0) { 
if (currentColorSection >= 1) { 
_ehSup = true;
}
else {
if (((currentColorSection !== 0) && (currentColorSection !== -2)) && (textFormatIndex > 1)) { 
_ehSup = true;
}
}
}
}
if (_ehSup) { 
if ((gradientSupOn) && (gradientSupEndColor !== "")) { 
targetColorHex = gradientSupEndColor;
}
}
else {
if ((gradientOn) && (gradientEndColor !== "")) { 
targetColorHex = gradientEndColor;
}
}
}
if (targetColorHex !== "") { 
var hx = targetColorHex.replace("#", "");
if (hx.length === 3) { 
hx = hx[0] + hx[0] + hx[1] + hx[1] + hx[2] + hx[2];
}
var rc = parseInt(hx.substring(0, 2), 16);
var gc = parseInt(hx.substring(2, 4), 16);
var bc = parseInt(hx.substring(4, 6), 16);
var applied = false;
if (typeof param2.setColorValue === "function") { 
try {
param2.setColorValue(255, rc, gc, bc, true);
applied = true;
} catch (eColor) {
}
}
if (!applied) { 
try {
var rf = rc / 255;
var gf = gc / 255;
var bf = bc / 255;
param2.setValue([rf, gf, bf, 1], true);
} catch (eFinal) {
}
}
}
}
}
if (((highlightSize > 0) || (supportSize > 0)) && (inheritedGroupIndex !== -2)) { 
var isSizeProp = (((((((pName2 === "tamanho") || (pName2 === "size")) || (pName2 === "pt")) || (pName2.indexOf("tamanho") !== -1)) || (pName2.indexOf("font size") !== -1)) || (pName2.indexOf("fontsize") !== -1)) || (pName2.indexOf("font sz") !== -1)) || ((pName2.indexOf("size") !== -1) && (pName2.indexOf("font") !== -1));
var isSizeDecor = (((((pName2.indexOf("shadow") !== -1) || (pName2.indexOf("sombra") !== -1)) || (pName2.indexOf("stroke") !== -1)) || (pName2.indexOf("borda") !== -1)) || (pName2.indexOf("glow") !== -1)) || (pName2.indexOf("back") !== -1);
var val2Num = typeof val2 === "number" ? val2 : parseFloat(val2);
var isNumericVal = (((!isNaN(val2Num)) && (val2Num > 0)) && (typeof val2 !== "boolean")) && ((typeof val2 !== "string") || ((val2.indexOf("{") === -1) && (val2.indexOf("[") === -1)));
if (((isSizeProp) && (!isSizeDecor)) && (isNumericVal)) { 
var textGroupForSize = inheritedGroupIndex;
if (textGroupForSize < 0) { 
var sizeNameMatch = pName2.match(/texto\s*(\d+)|text\s*(\d+)|(\d+)\s*$/);
if (sizeNameMatch) { 
var sGnum = parseInt(((sizeNameMatch[1]) || (sizeNameMatch[2])) || (sizeNameMatch[3]), 10);
if (principalSectionPName !== "") { 
var sSec = "text " + sGnum;
textGroupForSize = sSec === principalSectionPName ? 0 : 1;
}
else {
textGroupForSize = sGnum === 1 ? 0 : 1;
}
}
}
if (soloSecundaria) { 
textGroupForSize = 1;
}
var targetSize = 0;
if ((textGroupForSize === 0) && (highlightSize > 0)) { 
targetSize = highlightSize;
}
else if ((textGroupForSize >= 1) && (supportSize > 0)) {
targetSize = supportSize;
}
else {
if (textGroupForSize < 0) { 
if ((currentColorSection === 0) && (highlightSize > 0)) { 
targetSize = highlightSize;
}
else {
if ((currentColorSection >= 1) && (supportSize > 0)) { 
targetSize = supportSize;
}
}
}
}
if (targetSize > 0) { 
try {
param2.setValue(targetSize, true);
} catch (eSz) {try {
param2.setValue(String(targetSize), true);
} catch (eSz2) {
}
}
}
}
}
if (shadowValue >= 0) { 
var ehSombra = (pName2.indexOf("shadow") !== -1) || (pName2.indexOf("sombra") !== -1);
var ehGrupoSombra = false;
try {
ehGrupoSombra = (inheritedGroupIndex === -2) || (currentColorSection === -2);
} catch (eGp) {
}
var ehOpac = (pName2.indexOf("opacity") !== -1) || (pName2.indexOf("opacidade") !== -1);
var vNumS = typeof val2 === "number" ? val2 : parseFloat(val2);
var numericoS = ((!isNaN(vNumS)) && (typeof val2 !== "boolean")) && ((typeof val2 !== "string") || ((val2.indexOf("{") === -1) && (val2.indexOf("[") === -1)));
if (((numericoS) && (ehOpac)) && ((ehSombra) || (ehGrupoSombra))) { 
try {
param2.setValue(shadowValue, true);
} catch (eSh) {try {
param2.setValue(String(shadowValue), true);
} catch (eSh2) {
}
}
}
}
if (trackingValue > -201) { 
var ehTrack = (((pName2.indexOf("tracking") !== -1) || (pName2.indexOf("espa\xe7amento") !== -1)) || (pName2.indexOf("espacamento") !== -1)) || (pName2.indexOf("letter spacing") !== -1);
var vNumT = typeof val2 === "number" ? val2 : parseFloat(val2);
var numericoT = ((!isNaN(vNumT)) && (typeof val2 !== "boolean")) && ((typeof val2 !== "string") || ((val2.indexOf("{") === -1) && (val2.indexOf("[") === -1)));
if ((numericoT) && (ehTrack)) { 
try {
param2.setValue(trackingValue, true);
} catch (eTk) {try {
param2.setValue(String(trackingValue), true);
} catch (eTk2) {
}
}
}
}
} catch (epx) {
}}
};
processMgtProps(mgt.properties);
} catch (eMgtColor) {
}
}
try {
var _seqW = 1920;
var _seqH = 1080;
try {
var _seqSett = seq.getSettings();
if (_seqSett) { 
_seqW = (_seqSett.videoFrameWidth) || (1920);
_seqH = (_seqSett.videoFrameHeight) || (1080);
}
} catch (eSett) {
}
if ((!_seqW) || (!_seqH)) { 
try {
if (seq.frameSizeHorizontal) { 
_seqW = seq.frameSizeHorizontal;
}
if (seq.frameSizeVertical) { 
_seqH = seq.frameSizeVertical;
}
} catch (eFS2) {
}
}
var _isHoriz = _seqW > _seqH;
var _scalePct = 100;
var _posX = null;
var _posY = null;
if (_isHoriz) { 
_scalePct = Math.round(((_seqH / 1080) * 100) / 5) * 5;
_posY = Math.round((_seqH * 500) / 1080);
_posX = Math.round(_seqW / 2);
}
else {
if (scaleMode === "4k") { 
_scalePct = 200;
}
else if (scaleMode === "fhd") {
_scalePct = 100;
}
else {
var _tplW = 1080;
_scalePct = Math.round(((_seqW / _tplW) * 100) / 5) * 5;
if (_scalePct < 25) { 
_scalePct = 100;
}
if (_scalePct > 400) { 
_scalePct = 400;
}
}
}
var _motionFound = false;
var _comps = null;
try {
_comps = newMogrtClip.components;
} catch (eC) {
}
var _nComp = 0;
try {
_nComp = _comps ? _comps.numItems : 0;
} catch (eN) {
}
for (var _mci = 0; (_mci < _nComp) && (!_motionFound); _mci += 1) { 
var _mc = null;
try {
_mc = _comps[_mci];
} catch (e) {continue ;
}
if (!_mc) { 
continue ;
}
var _mcName = "";
try {
_mcName = (_mc.displayName) || ("");
} catch (e) {
}
var _mcl = _mcName.toLowerCase();
if (((_mcl.indexOf("motion") !== -1) || (_mcl.indexOf("movimento") !== -1)) || (_mcl.indexOf("movimiento") !== -1)) { 
var _ps = null;
try {
_ps = _mc.properties;
} catch (e) {
}
var _nP = 0;
try {
_nP = _ps ? _ps.numItems : 0;
} catch (e) {
}
for (var _mcp = 0; _mcp < _nP; _mcp += 1) { 
var _mprop = null;
try {
_mprop = _ps[_mcp];
} catch (e) {continue ;
}
if (!_mprop) { 
continue ;
}
var _mpName = "";
try {
_mpName = (_mprop.displayName) || ("");
} catch (e) {
}
var _mpl = _mpName.toLowerCase();
if ((((_mpl.indexOf("scale") === 0) || (_mpl.indexOf("escala") === 0)) && (_mpl.indexOf("uniform") === -1)) && (_mpl.indexOf("uniforme") === -1)) { 
try {
_mprop.setValue(_scalePct, true);
} catch (e) {
}
}
if ((_posX !== null) && (_mpl.indexOf("posi") === 0)) { 
try {
_mprop.setValue([Math.max(0, Math.min(1, _posX / _seqW)), Math.max(0, Math.min(1, _posY / _seqH))], true);
} catch (e) {
}
}}
_motionFound = true;
}}
} catch (eAutoPos) {
}
try {
if (maxEndTicks !== "") { 
var visualEndObj = newMogrtClip.end;
visualEndObj.ticks = maxEndTicks;
newMogrtClip.end = visualEndObj;
try {
var sourceOut = newMogrtClip.outPoint;
var bufferTicks = 7620480000000;
var totalSourceTicks = parseFloat(maxEndTicks) + bufferTicks;
sourceOut.ticks = totalSourceTicks.toString();
newMogrtClip.outPoint = sourceOut;
} catch (eSource) {
}
}
} catch (errEnd) {
}
return "Conclu\xeddo!";
}
else {
var breakError = "Erro nativo na inje\xe7\xe3o. Trilha alvo: " + targetTrackIndex + "\nMogrt: " + fsPath;
alert(breakError);
return breakError;
}
} catch (e) {alert("Erro FATAL: " + e.toString());
return "Erro FATAL: " + e.toString();
}
}
function _deleteControlLayers(comp) {
if ((!comp) || (!(comp instanceof CompItem))) { 
return;
}
for (var i = comp.numLayers; i >= 1; i--) { 
var layer = comp.layer(i);
var layerName = layer.name.toUpperCase();
if (((layerName.indexOf("CTRL") === 0) && (layerName.indexOf("CONTROL") !== 0)) && (layerName.indexOf("CONTROLE") !== 0)) { 
try {
layer.remove();
} catch (e) {
}
}}
}
function saveUserTemplate(jsonStringArgs) {
try {
var args = _fsJSON.parse(jsonStringArgs);
var category = (args.category) || ("Meus Modelos");
var subcategory = (args.subcategory) || ("02 LINE DUO");
var templateName = (args.templateName) || ("Template 01");
var renderPreview = args.renderPreview !== false;
var proj = app.project;
if (!proj) { 
return _fsJSON.stringify({error: "Nenhum projeto aberto.", success: false});
}
var comp = proj.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
return _fsJSON.stringify({error: "Selecione uma composi\xe7\xe3o primeiro.", success: false});
}
var textCount = 0;
for (var i = 1; i <= comp.numLayers; i += 1) { 
var layer = comp.layer(i);
if (layer instanceof TextLayer) { 
if (layer.name.toUpperCase().indexOf("TEXTO ") === 0) { 
textCount++;
}
}}
if (textCount === 0) { 
return _fsJSON.stringify({error: "Nenhuma camada \'TEXTO 1\', etc. encontrada na composi\xe7\xe3o.", success: false});
}
var userDocsPath = Folder.myDocuments.fsName.replace(/\\/g, "/");
var basePath = userDocsPath + "/Frame Speed/" + category + "/" + subcategory + "/" + templateName;
var parts = ["Frame Speed", category, subcategory, templateName];
var currentPath = userDocsPath;
for (var p = 0; p < parts.length; p += 1) { 
currentPath = currentPath + "/" + parts[p];
var f = new Folder(currentPath);
if (!f.exists) { 
if (!f.create()) { 
return _fsJSON.stringify({error: "N\xe3o foi poss\xedvel criar pasta: " + currentPath, success: false});
}
}}
var baseFolder = new Folder(basePath);
var results = {aep: false, mogrt: false, preview: false, thumb: false};
var midTime = comp.duration / 2;
var aepFile = new File(basePath + "/" + templateName + ".aep");
try {
proj.save(aepFile);
results.aep = true;
} catch (eAep) {results.aepError = eAep.toString();
}
var mogrtFileName = templateName + ".mogrt";
var mogrtFinalPath = basePath + "/" + mogrtFileName;
var tempExportPath = basePath + "/_temp_mogrt_export";
try {
var tempDir = new Folder(tempExportPath);
if (tempDir.exists) { 
var oldFiles = tempDir.getFiles();
for (var df = 0; df < oldFiles.length; df += 1) { 
try {
oldFiles[df].remove();
} catch (e) {
}}
tempDir.remove();
}
var exported = comp.exportAsMotionGraphicsTemplate(true, tempExportPath);
if (exported) { 
var realMogrt = new File(tempExportPath + "/template.mogrt");
if (realMogrt.exists) { 
results.mogrt = true;
results.mogrtNeedsCopy = true;
results.mogrtSourcePath = realMogrt.fsName;
results.mogrtFinalPath = new File(mogrtFinalPath).fsName;
results.mogrtTempDir = tempDir.fsName;
}
else {
var tempFiles = tempDir.getFiles("*.mogrt");
if (tempFiles.length > 0) { 
results.mogrt = true;
results.mogrtNeedsCopy = true;
results.mogrtSourcePath = tempFiles[0].fsName;
results.mogrtFinalPath = new File(mogrtFinalPath).fsName;
results.mogrtTempDir = tempDir.fsName;
}
else {
results.mogrtError = "MOGRT: nenhum arquivo .mogrt encontrado na pasta de exporta\xe7\xe3o.";
}
}
}
else {
results.mogrtError = "MOGRT: exporta\xe7\xe3o retornou falso.";
}
} catch (eMogrt) {results.mogrtError = "MOGRT: " + eMogrt.toString();
}
if (renderPreview) { 
var previewFile = new File(basePath + "/" + templateName + ".mp4");
try {
app.project.renderQueue.showWindow = true;
var renderComp = app.project.activeItem;
if ((!renderComp) || (!(renderComp instanceof CompItem))) { 
throw new Error("Composi\xe7\xe3o ativa n\xe3o encontrada para render.");
}
var queuedItems = [];
for (var i = 1; i <= app.project.renderQueue.numItems; i += 1) { 
if (app.project.renderQueue.item(i).status === RQItemStatus.QUEUED) { 
queuedItems.push(i);
app.project.renderQueue.item(i).render = false;
}}
var rqItem = app.project.renderQueue.items.add(renderComp);
rqItem.render = true;
var om = rqItem.outputModule(1);
var tpls = om.templates;
var videoTpls = ["H.264", "Lossless", "Sem perdas", "High Quality", "Apple ProRes", "Animation"];
var templateEscolhido = null;
for (var v = 0; (v < videoTpls.length) && (!templateEscolhido); v++) { 
for (var t = 0; (t < tpls.length) && (!templateEscolhido); t++) { 
if (tpls[t].toLowerCase().indexOf(videoTpls[v].toLowerCase()) !== -1) { 
templateEscolhido = tpls[t];
}}}
if (templateEscolhido) { 
om.applyTemplate(templateEscolhido);
}
else {
if (tpls.length > 0) { 
templateEscolhido = tpls[0];
om.applyTemplate(templateEscolhido);
}
}
var rawExt = ".mov";
if (templateEscolhido) { 
var lowName = templateEscolhido.toLowerCase();
if (lowName.indexOf("avi") !== -1) { 
rawExt = ".avi";
}
else {
if (lowName.indexOf("mp4") !== -1) { 
rawExt = ".mp4";
}
}
}
var rawFile = new File(basePath + "/_preview_raw" + rawExt);
om.file = rawFile;
if (rqItem.status === RQItemStatus.QUEUED) { 
app.project.renderQueue.render();
}
else {
throw new Error("Item na fila mas n\xe3o est\xe1 pronto (QUEUED). Status: " + rqItem.status);
}
if (rawFile.exists) { 
results.preview = true;
results.rawPreviewPath = rawFile.fsName;
}
try {
rqItem.remove();
} catch (e) {
}
for (var r = 0; r < queuedItems.length; r += 1) { 
try {
var itemIdx = queuedItems[r];
if (itemIdx <= app.project.renderQueue.numItems) { 
app.project.renderQueue.item(itemIdx).render = true;
}
} catch (e) {
}}
} catch (eRender) {results.previewError = "Render Trace: " + eRender.toString();
}
}
results.success = true;
results.summary = "AEP: " + results.aep ? "OK" : "Falhou | MOGRT: " + results.mogrt ? "OK" : (results.mogrtError) || ("Falhou | Thumb: " + results.thumb) ? "OK" : (results.thumbError) || ("Falhou | Preview: " + results.preview) ? "OK" : !renderPreview ? "Pulado" : (results.previewError) || ("Falhou");
return _fsJSON.stringify(results);
} catch (e) {return _fsJSON.stringify({error: "Erro fatal: " + e.toString(), success: false});
}
}
function getNextTemplateNumber(jsonStringArgs) {
try {
var args = _fsJSON.parse(jsonStringArgs);
var category = (args.category) || ("Meus Modelos");
var subcategory = (args.subcategory) || ("02 LINE DUO");
var userDocsPath = Folder.myDocuments.fsName.replace(/\\/g, "/");
var subPath = userDocsPath + "/Frame Speed/" + category + "/" + subcategory;
var subFolder = new Folder(subPath);
if (!subFolder.exists) { 
return _fsJSON.stringify({next: 1});
}
var folders = subFolder.getFiles(function (f) {
return f instanceof Folder;
});
var maxNum = 0;
for (var i = 0; i < folders.length; i += 1) { 
var name = decodeURI(folders[i].name);
var match = name.match(/Template\s+(\d+)/i);
if (match) { 
var num = parseInt(match[1]);
if (num > maxNum) { 
maxNum = num;
}
}}
return _fsJSON.stringify({next: maxNum + 1});
} catch (e) {return _fsJSON.stringify({next: 1});
}
}
function countActiveCompTexts() {
try {
var comp = app.project.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
return _fsJSON.stringify({count: 0, error: "Nenhuma composi\xe7\xe3o ativa"});
}
var count = 0;
var names = [];
for (var i = 1; i <= comp.numLayers; i += 1) { 
var layer = comp.layer(i);
if (layer instanceof TextLayer) { 
var layerName = layer.name.toUpperCase();
if (layerName.indexOf("TEXTO ") === 0) { 
count++;
names.push(layer.name);
}
}}
return _fsJSON.stringify({compName: comp.name, count: count, isFrase: count === 1, names: names});
} catch (e) {return _fsJSON.stringify({count: 0, error: e.toString()});
}
}
function createTempTextLayerAE(jsonArgs) {
try {
var args = _fsJSON.parse(jsonArgs);
var proj = app.project;
var comp = proj.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
return "ERRO: Sem comp ativa";
}
var layer = comp.layers.addText((args.text) || (""));
layer.inPoint = (args.startTime) || (0);
layer.outPoint = (args.endTime) || (layer.inPoint + 5);
for (var i = 1; i <= comp.numLayers; i += 1) { 
comp.layer(i).selected = false;}
layer.selected = true;
return "OK";
} catch (e) {return "ERRO:" + e.toString();
}
}
function getActiveSequenceUniqueId() {
try {
if ((app.project) && (app.project.activeSequence)) { 
var projPath = (app.project.path) || ("projeto_sem_nome");
var seqId = app.project.activeSequence.sequenceID;
return projPath + "|" + seqId;
}
} catch (e) {
}
return "sem_sequencia";
}
function forceProjectDirty() {
try {
if ((app.project) && (app.project.rootItem)) { 
var metadata = app.project.rootItem.getProjectMetadata();
app.project.rootItem.setProjectMetadata(metadata, ["Column.PropertyText.LogNotes"]);
return "Dirty: OK";
}
} catch (e) {
}
return "Dirty: Erro";
}
function _fsAcTpf(seq) {
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (e) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = _FS_AC_TPS / 30;
}
return tpf;
}
function _fsAcDisplayFormat(seq) {
var df = 0;
try {
var st = seq.getSettings();
if ((st) && (typeof st.videoDisplayFormat === "number")) { 
df = st.videoDisplayFormat;
}
} catch (e) {
}
return df;
}
function _fsAcTicksToTC(ticks, tpf, disp) {
function _p(n) {
return n < 10 ? "0" : "" + n;
}
var frames = Math.round(ticks / tpf);
if (frames < 0) { 
frames = 0;
}
var fps = _FS_AC_TPS / tpf;
var fpsInt = Math.round(fps);
var drop = (disp === 102) || (disp === 106);
var sep = drop ? ";" : ":";
if (drop) { 
var dc = fpsInt === 30 ? 2 : 4;
var fpm = (fpsInt * 60) - dc;
var fp10 = (fpm * 9) + (fpsInt * 60);
var blocks = Math.floor(frames / fp10);
var mrem = frames % fp10;
var extra = dc * 9 * blocks;
if (mrem >= (fpsInt * 60)) { 
extra += (dc * (Math.floor((mrem - (fpsInt * 60)) / fpm) + 1));
}
frames += extra;
}
var ff = frames % fpsInt;
var totS = Math.floor(frames / fpsInt);
var ss = totS % 60;
var mm = Math.floor(totS / 60) % 60;
var hh = Math.floor(totS / 3600);
return _p(hh) + sep + _p(mm) + sep + _p(ss) + sep + _p(ff);
}
function _fsAcTimeTicks(ticks) {
var t = new Time();
t.ticks = String(Math.round(ticks));
return t;
}
function _fsAcTrack(kind, idx) {
try {
var s = app.project.activeSequence;
return kind === "v" ? s.videoTracks[idx] : s.audioTracks[idx];
} catch (e) {return null;
}
}
function _fsAcFindByNode(kind, idx, nodeId) {
var tr = _fsAcTrack(kind, idx);
if (!tr) { 
return null;
}
for (var i = 0; i < tr.clips.numItems; i += 1) { 
try {
if (String(tr.clips[i].nodeId) === String(nodeId)) { 
return tr.clips[i];
}
} catch (e) {
}}
return null;
}
function _fsAcSnap(cl) {
try {
var s = parseFloat(cl.start.ticks);
var e = parseFloat(cl.end.ticks);
var ip = NaN;
var nid = "";
try {
ip = parseFloat(cl.inPoint.ticks);
} catch (eIp) {
}
try {
nid = String(cl.nodeId);
} catch (eN) {
}
if ((isNaN(s)) || (isNaN(e))) { 
return null;
}
return {dur: e - s, e: e, ip: ip, node: nid, s: s};
} catch (eS) {return null;
}
}
function _fsAcApplyMove(cl, deltaTicks, absTargetTicks, variant) {
try {
if (variant === "moveTicks") { 
var t1 = new Time();
t1.ticks = String(Math.round(deltaTicks));
cl.move(t1);
return true;
}
if (variant === "moveSecs") { 
var t2 = new Time();
t2.seconds = deltaTicks / _FS_AC_TPS;
cl.move(t2);
return true;
}
if (variant === "moveNum") { 
cl.move(deltaTicks / _FS_AC_TPS);
return true;
}
if (variant === "startAbs") { 
cl.start = _fsAcTimeTicks(absTargetTicks);
return true;
}
if (variant === "startEndAbs") { 
var snap = _fsAcSnap(cl);
if (!snap) { 
return false;
}
cl.start = _fsAcTimeTicks(absTargetTicks);
cl.end = _fsAcTimeTicks(absTargetTicks + snap.dur);
return true;
}
} catch (e) {
}
return false;
}
function _fsAcMoveVerified(kind, idx, nodeId, targetTicks, variant, half) {
var cl = _fsAcFindByNode(kind, idx, nodeId);
if (!cl) { 
return false;
}
var before = _fsAcSnap(cl);
if (!before) { 
return false;
}
var target = targetTicks;
if (target < 0) { 
target = 0;
}
var deltaTicks = target - before.s;
if (Math.abs(deltaTicks) <= half) { 
_FS_AC_NOOP++;
return true;
}
if (!_fsAcApplyMove(cl, deltaTicks, target, variant)) { 
return false;
}
var after = null;
var cl2 = _fsAcFindByNode(kind, idx, nodeId);
if (cl2) { 
after = _fsAcSnap(cl2);
}
if (!after) { 
return false;
}
if (Math.abs(after.s - target) > half) { 
return false;
}
if (Math.abs(after.dur - before.dur) > half) { 
return false;
}
if (((!isNaN(before.ip)) && (!isNaN(after.ip))) && (Math.abs(after.ip - before.ip) > half)) { 
return false;
}
return true;
}
function _fsAcRightmost(seq, vUse, aUse) {
var best = null;
for (var v = 0; v < seq.videoTracks.numTracks; v += 1) { 
if (!vUse[v]) { 
continue ;
}
tr = seq.videoTracks[v];
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
cl = tr.clips[c];
s = parseFloat(cl.start.ticks);
if ((!best) || (s > best.start)) { 
best = {idx: v, kind: "v", node: String(cl.nodeId), start: s};
}
} catch (e) {
}}}
for (var a = 0; a < seq.audioTracks.numTracks; a += 1) { 
if (!aUse[a]) { 
continue ;
}
tr = seq.audioTracks[a];
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
cl = tr.clips[c];
s = parseFloat(cl.start.ticks);
if ((!best) || (s > best.start)) { 
best = {idx: a, kind: "a", node: String(cl.nodeId), start: s};
}
} catch (e) {
}}}
return best;
}
function _fsAcProbe(seq, vUse, aUse, tpf, half, report) {
var target = _fsAcRightmost(seq, vUse, aUse);
if (!target) { 
return null;
}
if (report) { 
report.clip = {node: target.node, startTicks: target.start, track: target.kind === "v" ? "V" : "A" + target.idx + 1};
}
for (var i = 0; i < _FS_AC_VARIANTS.length; i += 1) { 
var vr = _FS_AC_VARIANTS[i];
var entry = {variant: vr};
var baseCl = _fsAcFindByNode(target.kind, target.idx, target.node);
var baseSn = baseCl ? _fsAcSnap(baseCl) : null;
var base = baseSn ? baseSn.s : target.start;
var okFwd = _fsAcMoveVerified(target.kind, target.idx, target.node, base + tpf, vr, half);
entry.forward = okFwd;
if (okFwd) { 
var okBack = _fsAcMoveVerified(target.kind, target.idx, target.node, base, vr, half);
entry.back = okBack;
if (report) { 
report.tries.push(entry);
}
if (okBack) { 
return vr;
}
var cl = _fsAcFindByNode(target.kind, target.idx, target.node);
if (cl) { 
try {
cl.start = _fsAcTimeTicks(target.start);
} catch (e) {
}
}
}
else {
var cl2 = _fsAcFindByNode(target.kind, target.idx, target.node);
var sn = cl2 ? _fsAcSnap(cl2) : null;
entry.landedTicks = sn ? sn.s : null;
entry.expectedTicks = target.start + tpf;
entry.durChanged = sn ? Math.abs(sn.dur - (sn.e - sn.s)) > half : null;
if ((sn) && (Math.abs(sn.s - target.start) > half)) { 
try {
cl2.start = _fsAcTimeTicks(target.start);
} catch (e2) {
}
}
if (report) { 
report.tries.push(entry);
}
}}
return null;
}
function fsAutocutDiag() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var tpf = _fsAcTpf(seq);
var half = tpf / 2;
var report = {clip: null, tries: []};
report.app = {build: (app.build) || ("?"), version: (app.version) || ("?")};
report.seq = {displayFormat: _fsAcDisplayFormat(seq), fps: _FS_AC_TPS / tpf, name: seq.name, timebase: String(seq.timebase)};
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeOk = false;
try {
qeOk = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeOk = false;
}
report.qe = qeOk;
var vUse = [];
var aUse = [];
for (var v = 0; v < seq.videoTracks.numTracks; v += 1) { 
var lv = false;
try {
lv = seq.videoTracks[v].isLocked();
} catch (e) {
}
vUse.push(!lv);}
for (var a = 0; a < seq.audioTracks.numTracks; a += 1) { 
var la = false;
try {
la = seq.audioTracks[a].isLocked();
} catch (e) {
}
aUse.push(!la);}
report.tracks = {audio: seq.audioTracks.numTracks, video: seq.videoTracks.numTracks};
var probeTarget = _fsAcRightmost(seq, vUse, aUse);
if (probeTarget) { 
var pc = _fsAcFindByNode(probeTarget.kind, probeTarget.idx, probeTarget.node);
if (pc) { 
report.api = {hasMove: typeof pc.move === "function", hasNodeId: false, startWritable: null};
try {
report.api.hasNodeId = String(pc.nodeId) !== "undefined";
} catch (e3) {
}
}
}
else {
report.api = {note: "nenhum clipe encontrado nas trilhas destravadas"};
}
var win = _fsAcProbe(seq, vUse, aUse, tpf, half, report);
report.winner = win;
return _fsJSON.stringify(report);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsAcScope(seq, mode) {
var TPS = _FS_AC_TPS;
if (mode === "clip") { 
var sel = null;
try {
sel = seq.getSelection();
} catch (e) {
}
if ((!sel) || (!sel.length)) { 
return {error: "Nenhum clipe selecionado. Clique num clipe na timeline primeiro."};
}
var mn = -1;
var mx = -1;
for (var i = 0; i < sel.length; i += 1) { 
var it = sel[i];
if (!it) { 
continue ;
}
var cs = NaN;
var ce = NaN;
try {
cs = parseFloat(it.start.ticks) / TPS;
ce = parseFloat(it.end.ticks) / TPS;
} catch (e2) {
}
if ((isNaN(cs)) || (isNaN(ce))) { 
continue ;
}
if ((mn < 0) || (cs < mn)) { 
mn = cs;
}
if ((mx < 0) || (ce > mx)) { 
mx = ce;
}}
if ((mn < 0) || (mx <= mn)) { 
return {error: "N\xe3o consegui ler o clipe selecionado."};
}
return {end: mx, start: mn};
}
if (mode === "inout") { 
var inS = NaN;
var outS = NaN;
try {
var iT = seq.getInPointAsTime();
if ((iT) && (typeof iT.seconds === "number")) { 
inS = iT.seconds;
}
} catch (e3) {
}
try {
var oT = seq.getOutPointAsTime();
if ((oT) && (typeof oT.seconds === "number")) { 
outS = oT.seconds;
}
} catch (e4) {
}
if (isNaN(inS)) { 
try {
inS = parseFloat(seq.getInPoint());
} catch (e5) {
}
}
if (isNaN(outS)) { 
try {
outS = parseFloat(seq.getOutPoint());
} catch (e6) {
}
}
if (((isNaN(inS)) || (isNaN(outS))) || (outS <= inS)) { 
return {error: "Marque o In (I) e o Out (O) na timeline primeiro."};
}
return {end: outS, start: inS};
}
var endS = 0;
try {
endS = parseFloat(seq.end) / TPS;
} catch (e7) {
}
if (((!endS) || (isNaN(endS))) || (endS <= 0)) { 
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
try {
var tr = seq.videoTracks[t];
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var e8 = parseFloat(tr.clips[c].end.ticks) / TPS;
if (e8 > endS) { 
endS = e8;
}}
} catch (e9) {
}}
for (var ta = 0; ta < seq.audioTracks.numTracks; ta += 1) { 
try {
var tra = seq.audioTracks[ta];
for (var ca = 0; ca < tra.clips.numItems; ca += 1) { 
var ea = parseFloat(tra.clips[ca].end.ticks) / TPS;
if (ea > endS) { 
endS = ea;
}}
} catch (e10) {
}}
}
if ((!endS) || (endS <= 0)) { 
return {error: "A sequ\xeancia parece vazia."};
}
return {end: endS, start: 0};
}
function fsAutocutExport(presetPath, mode, analyzeTrack) {
var mutedChanges = [];
var seqRef = null;
try {
var seq = app.project.activeSequence;
seqRef = seq;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var presetFile = new File(presetPath);
if (!presetFile.exists) { 
return _fsJSON.stringify({error: "Preset de \xe1udio n\xe3o encontrado em: " + presetPath});
}
var scope = _fsAcScope(seq, mode);
if (scope.error) { 
return _fsJSON.stringify({error: scope.error});
}
if ((typeof analyzeTrack === "number") && (analyzeTrack >= 0)) { 
if (analyzeTrack >= seq.audioTracks.numTracks) { 
return _fsJSON.stringify({error: "A trilha A" + analyzeTrack + 1 + " n\xe3o existe nesta sequ\xeancia."});
}
for (var ti = 0; ti < seq.audioTracks.numTracks; ti += 1) { 
var tr2 = seq.audioTracks[ti];
var cur = false;
try {
cur = tr2.isMuted();
} catch (eM) {
}
var want = ti !== analyzeTrack;
if (cur !== want) { 
try {
tr2.setMute(want ? 1 : 0);
mutedChanges.push({idx: ti, prev: cur ? 1 : 0});
} catch (eS) {
}
}}
}
var wat = mode === "inout" ? 1 : 0;
var offset = mode === "inout" ? scope.start : 0;
var tmpName = "fs_autocut_" + new Date().getTime() + ".mp3";
var outFileObj = new File(Folder.temp.fsName + "/" + tmpName);
var outNative = outFileObj.fsName;
var expErr = null;
try {
seq.exportAsMediaDirect(outNative, presetFile.fsName, wat);
} catch (eExp) {expErr = eExp.toString();
}
for (var ti = 0; ti < mutedChanges.length; ti += 1) { 
try {
seq.audioTracks[mutedChanges[ti].idx].setMute(mutedChanges[ti].prev);
} catch (eR) {
}}
mutedChanges = [];
if (expErr) { 
return _fsJSON.stringify({error: "Falha na exporta\xe7\xe3o: " + expErr});
}
var check = new File(outNative);
if ((!check.exists) || (check.length <= 0)) { 
return _fsJSON.stringify({error: "\xc1udio n\xe3o foi gerado (a sequ\xeancia tem \xe1udio nesse trecho?)."});
}
var tpf = _fsAcTpf(seq);
return _fsJSON.stringify({fps: _FS_AC_TPS / tpf, offset: offset, ok: true, path: check.fsName, rangeEnd: scope.end, rangeStart: scope.start});
} catch (e) {for (var mi = 0; mi < mutedChanges.length; mi += 1) { 
try {
seqRef.audioTracks[mutedChanges[mi].idx].setMute(mutedChanges[mi].prev);
} catch (eR2) {
}}
return _fsJSON.stringify({error: e.toString()});
}
}
function _fsAcNormalizeCuts(cuts, tpf, half) {
var TPS = _FS_AC_TPS;
var rr = [];
for (var i = 0; i < cuts.length; i += 1) { 
var s = parseFloat(cuts[i].s);
var e = parseFloat(cuts[i].e);
if ((isNaN(s)) || (isNaN(e))) { 
continue ;
}
var EPS = tpf * 1e-06;
var sT = Math.ceil(((s * TPS) - EPS) / tpf) * tpf;
var eT = Math.floor(((e * TPS) + EPS) / tpf) * tpf;
if (sT < 0) { 
sT = 0;
}
if ((eT - sT) >= tpf) { 
rr.push({e: eT, s: sT});
}}
if (!rr.length) { 
return [];
}
for (var a = 1; a < rr.length; a += 1) { 
var v = rr[a];
var b = a - 1;
while ((b >= 0) && (rr[b].s > v.s)) {
rr[b + 1] = rr[b];
b--;
}
rr[b + 1] = v;}
var merged = [rr[0]];
for (var m = 1; m < rr.length; m += 1) { 
var last = merged[merged.length - 1];
if (rr[m].s <= (last.e + half)) { 
if (rr[m].e > last.e) { 
last.e = rr[m].e;
}
}
else {
merged.push(rr[m]);
}}
return merged;
}
function _fsAcTrackFlags(seq) {
function _locked(tr) {
var l = false;
try {
l = tr.isLocked();
} catch (e) {
}
return l;
}
var vN = seq.videoTracks.numTracks;
var aN = seq.audioTracks.numTracks;
var vUse = [];
var aUse = [];
var lockedCount = 0;
for (var v = 0; v < vN; v += 1) { 
if (_locked(seq.videoTracks[v])) { 
lockedCount++;
vUse.push(false);
}
else {
vUse.push(true);
}}
for (var a = 0; a < aN; a += 1) { 
if (_locked(seq.audioTracks[a])) { 
lockedCount++;
aUse.push(false);
}
else {
aUse.push(true);
}}
return {aN: aN, aUse: aUse, lockedCount: lockedCount, vN: vN, vUse: vUse};
}
function _fsAcPediuParar(sinal) {
if ((!sinal) || (!sinal.parar)) { 
return false;
}
try {
return new File(sinal.parar).exists;
} catch (e) {return false;
}
}
function _fsAcProgresso(sinal, fase, feitos, total) {
if ((!sinal) || (!sinal.prog)) { 
return;
}
try {
var f = new File(sinal.prog);
f.encoding = "UTF-8";
if (f.open("w")) { 
f.write(_fsJSON.stringify({fase: fase, feitos: feitos, total: total}));
f.close();
}
} catch (e) {
}
}
function _fsAcRunPhases(merged, strategy, sinal) {
function _qeSeq() {
try {
return qe.project.getActiveSequence();
} catch (e) {return null;
}
}
function _razorAll(tick) {
var tc = _fsAcTicksToTC(tick, tpf, disp);
var n = 0;
var qs = _qeSeq();
if (!qs) { 
return 0;
}
for (var v2 = 0; v2 < vN; v2 += 1) { 
if (!vUse[v2]) { 
continue ;
}
try {
qs.getVideoTrackAt(v2).razor(tc);
n++;
} catch (e) {
}}
for (var a2 = 0; a2 < aN; a2 += 1) { 
if (!aUse[a2]) { 
continue ;
}
try {
qs.getAudioTrackAt(a2).razor(tc);
n++;
} catch (e) {
}}
return n;
}
function _eachTrackIdx(fn) {
for (var v3 = 0; v3 < vN; v3 += 1) { 
if (vUse[v3]) { 
fn("v", v3);
}}
for (var a3 = 0; a3 < aN; a3 += 1) { 
if (aUse[a3]) { 
fn("a", a3);
}}
}
function _inAnyCut(cs, ce) {
for (var k = 0; k < merged.length; k += 1) { 
if ((cs >= (merged[k].s - half)) && (ce <= (merged[k].e + half))) { 
return true;
}
if (merged[k].s > ce) { 
break ;
}}
return false;
}
function _cutBefore(tick) {
var acc = 0;
for (var k = 0; k < merged.length; k += 1) { 
if (merged[k].e <= (tick + half)) { 
acc += (merged[k].e - merged[k].s);
}
else {
break ;
}}
return acc;
}
var _t0 = new Date().getTime();
var seq = app.project.activeSequence;
var tpf = _fsAcTpf(seq);
var disp = _fsAcDisplayFormat(seq);
var half = tpf / 2;
var fl = _fsAcTrackFlags(seq);
var vN = fl.vN;
var aN = fl.aN;
var vUse = fl.vUse;
var aUse = fl.aUse;
var razors = 0;
var pararEm = -1;
for (var r = 0; r < merged.length; r += 1) { 
if ((sinal) && ((r % _FS_AC_PASSO) === 0)) { 
_fsAcProgresso(sinal, "lamina", r, merged.length);
if (_fsAcPediuParar(sinal)) { 
pararEm = r;
break ;
}
}
razors += _razorAll(merged[r].s);
razors += _razorAll(merged[r].e);}
if (pararEm >= 0) { 
return {failedShifts: 0, fase: "lamina", feitos: pararEm, lockedTracks: fl.lockedCount, msRazor: new Date().getTime() - _t0, msReligar: 0, msZiper: 0, parou: true, razors: razors, relinkFail: 0, relinked: 0, removed: 0, shifted: 0, total: merged.length};
}
var _tRazor = new Date().getTime();
var plano = [];
_eachTrackIdx(function (kind, idx) {
var tr = _fsAcTrack(kind, idx);
if (!tr) { 
return;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
var cl = tr.clips[c];
var cs = parseFloat(cl.start.ticks);
var ce = parseFloat(cl.end.ticks);
if (_inAnyCut(cs, ce)) { 
plano.push({idx: idx, kind: kind, node: String(cl.nodeId), start: cs, tirar: true});
}
else {
var sh = _cutBefore(cs);
if (sh <= 0) { 
continue ;
}
plano.push({idx: idx, kind: kind, node: String(cl.nodeId), start: cs, target: cs - sh});
}
} catch (e) {
}}
});
for (var p1 = 1; p1 < plano.length; p1 += 1) { 
var pv = plano[p1];
var p2 = p1 - 1;
while ((p2 >= 0) && (plano[p2].start > pv.start)) {
plano[p2 + 1] = plano[p2];
p2--;
}
plano[p2 + 1] = pv;}
var removed = 0;
var shifted = 0;
var failedShifts = 0;
_FS_AC_NOOP = 0;
for (var pi = 0; pi < plano.length; pi += 1) { 
if ((sinal) && ((pi % _FS_AC_PASSO) === 0)) { 
_fsAcProgresso(sinal, "ziper", pi, plano.length);
}
var it = plano[pi];
if (it.tirar) { 
var alvo = _fsAcFindByNode(it.kind, it.idx, it.node);
if (alvo) { 
try {
alvo.remove(false, false);
removed++;
} catch (eRm) {
}
}
}
else {
if (_fsAcMoveVerified(it.kind, it.idx, it.node, it.target, strategy, half)) { 
shifted++;
}
else {
failedShifts++;
}
}}
var _tZiper = new Date().getTime();
var relinked = 0;
var relinkFail = 0;
try {
if (typeof seq.linkSelection === "function") { 
function _links(cl) {
try {
var li = cl.getLinkedItems();
try {
return li.numItems;
} catch (e1) {return li.length;
}
} catch (e2) {return -1;
}
}
_eachTrackIdx(function (kind, idx) {
var tr = _fsAcTrack(kind, idx);
if (!tr) { 
return;
}
for (var c4 = 0; c4 < tr.clips.numItems; c4 += 1) { 
try {
tr.clips[c4].setSelected(false, false);
} catch (eDs) {
}}
});
var aIdx = {};
for (var a4 = 0; a4 < aN; a4 += 1) { 
if (!aUse[a4]) { 
continue ;
}
var trA = _fsAcTrack("a", a4);
if (!trA) { 
continue ;
}
for (var ca = 0; ca < trA.clips.numItems; ca += 1) { 
try {
var clA = trA.clips[ca];
var chave = String(Math.round(parseFloat(clA.start.ticks) / tpf));
if (!aIdx[chave]) { 
aIdx[chave] = [];
}
aIdx[chave].push(clA);
} catch (eIx) {
}}}
for (var v4 = 0; v4 < vN; v4 += 1) { 
if (!vUse[v4]) { 
continue ;
}
var trV = _fsAcTrack("v", v4);
if (!trV) { 
continue ;
}
for (var cv = 0; cv < trV.clips.numItems; cv += 1) { 
var clV = trV.clips[cv];
if (_links(clV) >= 2) { 
continue ;
}
var vs = 0;
var ve = 0;
var vNome = "";
try {
vs = parseFloat(clV.start.ticks);
ve = parseFloat(clV.end.ticks);
vNome = String(clV.name);
} catch (eV4) {continue ;
}
var cand = (aIdx[String(Math.round(vs / tpf))]) || ([]);
var par = [];
for (var q4 = 0; q4 < cand.length; q4 += 1) { 
try {
var cA = cand[q4];
if (String(cA.name) !== vNome) { 
continue ;
}
var as4 = parseFloat(cA.start.ticks);
var ae4 = parseFloat(cA.end.ticks);
if (((Math.abs(as4 - vs) <= half) && (Math.abs(ae4 - ve) <= half)) && (_links(cA) < 2)) { 
par.push(cA);
}
} catch (eC4) {
}}
if (!par.length) { 
continue ;
}
try {
clV.setSelected(true, true);
} catch (eS4) {continue ;
}
for (var q5 = 0; q5 < par.length; q5 += 1) { 
try {
par[q5].setSelected(true, false);
} catch (eS5) {
}}
try {
seq.linkSelection();
} catch (eL4) {
}
if (_links(clV) >= 2) { 
relinked++;
}
else {
relinkFail++;
}
try {
clV.setSelected(false, false);
} catch (eD4) {
}
for (var q6 = 0; q6 < par.length; q6 += 1) { 
try {
par[q6].setSelected(false, false);
} catch (eD5) {
}}}}
}
} catch (eF4) {
}
return {failedShifts: failedShifts, lockedTracks: fl.lockedCount, msRazor: _tRazor - _t0, msReligar: new Date().getTime() - _tZiper, msZiper: _tZiper - _tRazor, razors: razors, relinkFail: relinkFail, relinked: relinked, removed: removed, shifted: shifted};
}
function _fsAcDeleteSeq(id, protectId) {
if ((((id === null) || (id === undefined)) || (String(id) === "-1")) || (String(id) === "")) { 
return false;
}
if (String(id) === String(protectId)) { 
return false;
}
try {
for (var i = 0; i < app.project.sequences.numSequences; i += 1) { 
var s = app.project.sequences[i];
var sid = "";
try {
sid = String(s.sequenceID);
} catch (eS) {continue ;
}
if (sid === String(id)) { 
try {
app.project.deleteSequence(s);
return true;
} catch (eD) {return false;
}
}}
} catch (e) {
}
return false;
}
function fsAutocutApply(cutsJson, optsJson) {
try {
function _qeSeq() {
try {
return qe.project.getActiveSequence();
} catch (e) {return null;
}
}
function _locked(tr) {
var l = false;
try {
l = tr.isLocked();
} catch (e) {
}
return l;
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var cuts = null;
var opts = null;
try {
cuts = _fsJSON.parse(cutsJson);
} catch (eC) {
}
try {
opts = _fsJSON.parse(optsJson);
} catch (eO) {
}
if ((!cuts) || (!cuts.length)) { 
return _fsJSON.stringify({error: "Nenhum corte para aplicar."});
}
if (!opts) { 
opts = {};
}
var TPS = _FS_AC_TPS;
var tpf = _fsAcTpf(seq);
var disp = _fsAcDisplayFormat(seq);
var half = tpf / 2;
var merged = _fsAcNormalizeCuts(cuts, tpf, half);
if (!merged.length) { 
return _fsJSON.stringify({error: "Cortes curtos demais (menores que 1 frame)."});
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeOk = false;
try {
qeOk = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeOk = false;
}
if (!qeOk) { 
return _fsJSON.stringify({error: "N\xe3o consegui acessar o motor de corte do Premiere (QE). Reinicie o Premiere e tente de novo \u2014 nada foi alterado na timeline."});
}
var vN = seq.videoTracks.numTracks;
var aN = seq.audioTracks.numTracks;
var lockedCount = 0;
var vUse = [];
var aUse = [];
for (var vt = 0; vt < vN; vt += 1) { 
if (_locked(seq.videoTracks[vt])) { 
lockedCount++;
vUse.push(false);
}
else {
vUse.push(true);
}}
for (var at = 0; at < aN; at += 1) { 
if (_locked(seq.audioTracks[at])) { 
lockedCount++;
aUse.push(false);
}
else {
aUse.push(true);
}}
_FS_AC_NOOP = 0;
var strategy = _fsAcProbe(seq, vUse, aUse, tpf, half, null);
if (!strategy) { 
return _fsJSON.stringify({error: "N\xe3o consegui reposicionar clipes por script nesta vers\xe3o do Premiere \u2014 os cortes ficariam com buracos, ent\xe3o nada foi alterado na timeline.", needDiag: true});
}
var backupName = "";
var backupId = -1;
if (opts.backup) { 
var origId = -1;
var origName = "";
try {
origId = seq.sequenceID;
} catch (eId) {
}
try {
origName = seq.name;
} catch (eNm) {
}
var seenIds = {};
try {
for (var sb = 0; sb < app.project.sequences.numSequences; sb += 1) { 
try {
seenIds[String(app.project.sequences[sb].sequenceID)] = 1;
} catch (eSb) {
}}
} catch (eEnum) {
}
try {
seq.clone();
} catch (eCl) {
}
try {
for (var sc = 0; sc < app.project.sequences.numSequences; sc += 1) { 
var cs2 = app.project.sequences[sc];
var cid = "";
try {
cid = String(cs2.sequenceID);
} catch (eCid) {continue ;
}
if (!seenIds[cid]) { 
backupId = cid;
var _base = origName ? origName : "Sequ\xeancia";
var _CARIMBOS = [" \u2014 sem corte", " \u2014 antes do AutoCut"];
for (var _c = 0; _c < _CARIMBOS.length; _c += 1) { 
while (_base.indexOf(_CARIMBOS[_c]) !== -1) {
_base = _base.split(_CARIMBOS[_c]).join("");
}}
var wanted = _base + " \u2014 sem corte";
try {
cs2.name = wanted;
} catch (eRn) {
}
try {
if (cs2.projectItem) { 
cs2.projectItem.name = wanted;
}
} catch (eRn2) {
}
try {
backupName = cs2.name;
} catch (eBn) {backupName = wanted;
}
break ;
}}
} catch (eFind) {
}
try {
var act = app.project.activeSequence;
if (((act) && (origId !== -1)) && (act.sequenceID !== origId)) { 
for (var sq = 0; sq < app.project.sequences.numSequences; sq += 1) { 
var cand = app.project.sequences[sq];
if ((cand) && (cand.sequenceID === origId)) { 
app.project.activeSequence = cand;
break ;
}}
}
seq = app.project.activeSequence;
} catch (eAct) {
}
}
_FS_AC_NOOP = 0;
var sinal = null;
if ((opts.pararArq) || (opts.progArq)) { 
sinal = {parar: (opts.pararArq) || (""), prog: (opts.progArq) || ("")};
}
var ph = _fsAcRunPhases(merged, strategy, sinal);
if (ph.parou) { 
return _fsJSON.stringify({alreadyInPlace: 0, backup: backupName, backupId: backupId, cuts: 0, failedShifts: 0, fase: ph.fase, fases: {razorMs: (ph.msRazor) || (0), religarMs: 0, ziperMs: 0}, feitos: ph.feitos, lockedTracks: lockedCount, ok: true, parou: true, razors: ph.razors, relinkFail: 0, relinked: 0, removed: 0, seqId: (function () {
try {
return String(app.project.activeSequence.sequenceID);
} catch (e) {return "";
}
})(), shifted: 0, skipped: 0, strategy: strategy, total: ph.total});
}
var razors = ph.razors;
var removed = ph.removed;
var shifted = ph.shifted;
var failedShifts = ph.failedShifts;
var skipped = 0;
var res = {alreadyInPlace: _FS_AC_NOOP, backup: backupName, backupId: backupId, cuts: merged.length, failedShifts: failedShifts, fases: {razorMs: (ph.msRazor) || (0), religarMs: (ph.msReligar) || (0), ziperMs: (ph.msZiper) || (0)}, lockedTracks: lockedCount, ok: true, razors: razors, relinkFail: (ph.relinkFail) || (0), relinked: (ph.relinked) || (0), removed: removed, seqId: (function () {
try {
return String(app.project.activeSequence.sequenceID);
} catch (e) {return "";
}
})(), shifted: shifted, skipped: skipped, strategy: strategy};
if (failedShifts > 0) { 
res.warning = "Alguns clipes n\xe3o puderam ser puxados (" + failedShifts + "). Confira a timeline" + backupName ? " \u2014 a c\xf3pia de seguran\xe7a est\xe1 no projeto." : ".";
}
if (ph.relinkFail > 0) { 
res.warning = res.warning ? res.warning + " " : "" + ph.relinkFail + " par(es) de v\xeddeo e \xe1udio n\xe3o aceitaram religar \u2014 selecione os dois e use Link no menu.";
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsAutocutSetStep(backupId, cutsJson, keepCount, prevId) {
try {
var proj = app.project;
var backup = null;
for (var i = 0; i < proj.sequences.numSequences; i += 1) { 
var s = proj.sequences[i];
var sid = "";
try {
sid = String(s.sequenceID);
} catch (eS) {continue ;
}
if (sid === String(backupId)) { 
backup = s;
break ;
}}
if (!backup) { 
return _fsJSON.stringify({error: "A c\xf3pia de seguran\xe7a n\xe3o est\xe1 mais no projeto (foi apagada ou o projeto foi trocado)."});
}
var cuts = null;
try {
cuts = _fsJSON.parse(cutsJson);
} catch (eP) {
}
if (!cuts) { 
cuts = [];
}
var baseName = "";
try {
baseName = backup.name;
var _CARIMBOS2 = [" \u2014 sem corte", " \u2014 antes do AutoCut"];
for (var _c2 = 0; _c2 < _CARIMBOS2.length; _c2 += 1) { 
while (baseName.indexOf(_CARIMBOS2[_c2]) !== -1) {
baseName = baseName.split(_CARIMBOS2[_c2]).join("");
}}
} catch (eN) {baseName = "Sequ\xeancia";
}
var tpfB = _fsAcTpf(backup);
var halfB = tpfB / 2;
var allMerged = _fsAcNormalizeCuts(cuts, tpfB, halfB);
var keep = parseInt(keepCount, 10);
if ((isNaN(keep)) || (keep < 0)) { 
keep = 0;
}
if (keep > allMerged.length) { 
keep = allMerged.length;
}
if (keep === 0) { 
try {
proj.openSequence(String(backupId));
} catch (eO) {
}
try {
proj.activeSequence = backup;
} catch (eA) {
}
_fsAcDeleteSeq(prevId, backupId);
var bn = "";
try {
bn = backup.name;
} catch (eB) {
}
return _fsJSON.stringify({atOriginal: true, id: String(backupId), keep: 0, name: bn, ok: true, total: allMerged.length});
}
var seen = {};
for (var j = 0; j < proj.sequences.numSequences; j += 1) { 
try {
seen[String(proj.sequences[j].sequenceID)] = 1;
} catch (eJ) {
}}
try {
proj.activeSequence = backup;
} catch (eAB) {
}
try {
backup.clone();
} catch (eC) {
}
var work = null;
for (var k = 0; k < proj.sequences.numSequences; k += 1) { 
var c2 = proj.sequences[k];
var cid = "";
try {
cid = String(c2.sequenceID);
} catch (eC2) {continue ;
}
if (!seen[cid]) { 
work = c2;
break ;
}}
if (!work) { 
return _fsJSON.stringify({error: "N\xe3o consegui duplicar a sequ\xeancia pra reconstruir os cortes."});
}
var wname = baseName + " \u2014 AutoCut (" + keep + " de " + allMerged.length + ")";
try {
work.name = wname;
} catch (eW) {
}
try {
if (work.projectItem) { 
work.projectItem.name = wname;
}
} catch (eW2) {
}
var workId = "";
try {
workId = String(work.sequenceID);
} catch (eWi) {
}
try {
proj.openSequence(workId);
} catch (eO2) {
}
try {
proj.activeSequence = work;
} catch (eA2) {
}
var seq = app.project.activeSequence;
var tpf = _fsAcTpf(seq);
var half = tpf / 2;
var sub = [];
for (var m = 0; m < keep; m += 1) { 
sub.push(allMerged[m]);}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeOk = false;
try {
qeOk = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeOk = false;
}
if (!qeOk) { 
_fsAcDeleteSeq(workId, backupId);
try {
proj.activeSequence = backup;
} catch (eAr) {
}
return _fsJSON.stringify({error: "N\xe3o consegui acessar o motor de corte do Premiere (QE). Nada foi alterado."});
}
var fl = _fsAcTrackFlags(seq);
_FS_AC_NOOP = 0;
var strategy = _fsAcProbe(seq, fl.vUse, fl.aUse, tpf, half, null);
if (!strategy) { 
_fsAcDeleteSeq(workId, backupId);
try {
proj.activeSequence = backup;
} catch (eAr2) {
}
return _fsJSON.stringify({error: "N\xe3o consegui reposicionar clipes por script nesta vers\xe3o do Premiere. Nada foi alterado.", needDiag: true});
}
var ph = _fsAcRunPhases(sub, strategy);
_fsAcDeleteSeq(prevId, backupId);
return _fsJSON.stringify({alreadyInPlace: _FS_AC_NOOP, failedShifts: ph.failedShifts, id: workId, keep: keep, lockedTracks: ph.lockedTracks, name: wname, ok: true, removed: ph.removed, shifted: ph.shifted, total: allMerged.length});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsAutocutRestore(backupId) {
try {
if (((backupId === null) || (backupId === undefined)) || (String(backupId) === "-1")) { 
return _fsJSON.stringify({error: "N\xe3o h\xe1 c\xf3pia de seguran\xe7a desta sess\xe3o."});
}
var target = null;
for (var i = 0; i < app.project.sequences.numSequences; i += 1) { 
var s = app.project.sequences[i];
var sid = "";
try {
sid = String(s.sequenceID);
} catch (eS) {continue ;
}
if (sid === String(backupId)) { 
target = s;
break ;
}}
if (!target) { 
return _fsJSON.stringify({error: "A c\xf3pia de seguran\xe7a n\xe3o est\xe1 mais no projeto (foi apagada ou o projeto foi trocado)."});
}
var cutName = "";
try {
cutName = app.project.activeSequence.name;
} catch (eC) {
}
try {
app.project.openSequence(String(backupId));
} catch (eO) {
}
try {
app.project.activeSequence = target;
} catch (eA) {
}
var nowName = "";
try {
nowName = app.project.activeSequence.name;
} catch (eN) {
}
return _fsJSON.stringify({cutName: cutName, name: nowName, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsAchaCompMovimento(clip) {
if (!clip) { 
return null;
}
var comps = null;
try {
comps = clip.components;
} catch (eC) {return null;
}
if (!comps) { 
return null;
}
for (var i = 0; i < comps.numItems; i += 1) { 
var c = null;
try {
c = comps[i];
} catch (eI) {continue ;
}
if (!c) { 
continue ;
}
var dn = "";
var mn = "";
try {
dn = _fsSemAcento(c.displayName);
} catch (eD) {
}
try {
mn = String(c.matchName);
} catch (eM) {
}
if ((((dn.indexOf("motion") === 0) || (dn.indexOf("movimento") === 0)) || (mn === "AE.ADBE Motion")) || (mn === "ADBE Motion")) { 
return c;
}}
return null;
}
function _fsScForma(v) {
if ((v === null) || (v === undefined)) { 
return "?";
}
if (typeof v === "boolean") { 
return "b";
}
if (typeof v === "number") { 
return "n";
}
if ((typeof v.length === "number") && (typeof v !== "string")) { 
return "L" + v.length;
}
return "s";
}
function _fsScMesmoValor(a, b) {
if ((((a === null) || (a === undefined)) || (b === null)) || (b === undefined)) { 
return false;
}
var la = (typeof a.length === "number") && (typeof a !== "string");
var lb = (typeof b.length === "number") && (typeof b !== "string");
if (la !== lb) { 
return false;
}
if (la) { 
if (a.length !== b.length) { 
return false;
}
for (var i = 0; i < a.length; i += 1) { 
if (!_fsScMesmoValor(a[i], b[i])) { 
return false;
}}
return true;
}
var na = parseFloat(a);
var nb = parseFloat(b);
if ((!isNaN(na)) && (!isNaN(nb))) { 
return Math.abs(na - nb) < 0.0001;
}
return String(a) === String(b);
}
function _fsScIsPosName(n) {
var s = (n) || ("").toLowerCase();
return (((((s.indexOf("posi") !== -1) || (s.indexOf("position") !== -1)) || (s.indexOf("escala") !== -1)) || (s.indexOf("scale") !== -1)) || (s.indexOf("rota") !== -1)) || (s.indexOf("rotation") !== -1);
}
function _fsScIsTextVal(v) {
return (typeof v === "string") && (v.indexOf("textEditValue") !== -1);
}
function _fsScIsColorName(n) {
var s = (n) || ("").toLowerCase();
if (/\bcolou?rs?\b/.test(s)) { 
return true;
}
if (/\bcor(es)?\b/.test(s)) { 
return true;
}
return false;
}
function _fsScLooksLikeColor(v) {
if (typeof v === "string") { 
return /^#?[0-9a-fA-F]{6,8}$/.test(v.replace(/\s/g, ""));
}
if ((v !== null) && (typeof v === "object")) { 
var n = -1;
try {
n = v.length;
} catch (e) {return false;
}
if ((n !== 3) && (n !== 4)) { 
return false;
}
for (var i = 0; i < n; i += 1) { 
if (typeof v[i] !== "number") { 
return false;
}}
return true;
}
return false;
}
function _fsScIsColorProp(p, name, val) {
try {
if (typeof p.setColorValue !== "function") { 
return false;
}
} catch (e) {return false;
}
if (_fsScIsColorName(name)) { 
return true;
}
return _fsScLooksLikeColor(val);
}
function _fsScNormColor(v) {
if ((v === null) || (v === undefined)) { 
return null;
}
if (typeof v === "string") { 
var h = v.replace(/[^0-9a-fA-F]/g, "");
if (h.length < 6) { 
return null;
}
return {a: 255, b: parseInt(h.substring(4, 6), 16), g: parseInt(h.substring(2, 4), 16), r: parseInt(h.substring(0, 2), 16)};
}
if ((typeof v === "object") && (v.length >= 3)) { 
function _c(x) {
x = Math.round(x);
if (x < 0) { 
x = 0;
}
if (x > 255) { 
x = 255;
}
return x;
}
var arr = [];
for (var i = 0; i < v.length; i += 1) { 
arr.push(Number(v[i]));}
var mx = Math.max(arr[0], Math.max(arr[1], arr[2]));
var sc = mx <= 1.0001 ? 255 : 1;
var a = 255;
if (arr.length > 3) { 
a = _c(arr[3] * arr[3] <= 1.0001 ? 255 : 1);
}
return {a: a, b: _c(arr[2] * sc), g: _c(arr[1] * sc), r: _c(arr[0] * sc)};
}
return null;
}
function _fsScFerido(p, onde) {
var nome = "";
try {
nome = String((p.displayName) || (""));
} catch (e) {
}
_FS_SC_FERIDOS.push({onde: onde, param: (nome) || ("(sem nome)")});
}
function _fsScEchoRestore(p, raw0) {
if ((!raw0) || (raw0.hex)) { 
return !(!((raw0) && (raw0.hex)));
}
if ((!raw0.arr) || (raw0.arr.length < 3)) { 
return false;
}
var a0 = raw0.arr;
var candidatos = [];
if (a0.length > 3) { 
candidatos.push([a0[0], a0[1], a0[2], a0[3]]);
candidatos.push([a0[3], a0[0], a0[1], a0[2]]);
candidatos.push([a0[1], a0[2], a0[3], a0[0]]);
}
else {
candidatos.push([255, a0[0], a0[1], a0[2]]);
candidatos.push([a0[0], a0[1], a0[2], 255]);
candidatos.push([1, a0[0], a0[1], a0[2]]);
candidatos.push([a0[0], a0[1], a0[2], 1]);
}
for (var i = 0; i < candidatos.length; i += 1) { 
var c = candidatos[i];
var ok = false;
try {
p.setColorValue(c[0], c[1], c[2], c[3], true);
ok = true;
} catch (e1) {
}
if (!ok) { 
try {
p.setColorValue(c[0], c[1], c[2], c[3]);
ok = true;
} catch (e2) {
}
}
if (!ok) { 
continue ;
}
var agora = _fsScRawColor(p);
if (((agora) && (agora.arr)) && (_fsScMesmoValor(agora.arr, a0))) { 
return true;
}}
return false;
}
function _fsScRawColor(p) {
var v = null;
try {
v = p.getColorValue();
} catch (e) {
}
if ((v === null) || (v === undefined)) { 
try {
v = p.getValue();
} catch (e2) {
}
}
if ((v === null) || (v === undefined)) { 
return null;
}
if (typeof v === "string") { 
var h = v.replace(/[^0-9a-fA-F]/g, "");
if (h.length < 6) { 
return null;
}
return {hex: h};
}
var arr = [];
try {
for (var i = 0; i < v.length; i += 1) { 
arr.push(Number(v[i]));}
} catch (eA) {return null;
}
if (arr.length < 3) { 
return null;
}
return {arr: arr};
}
function _fsScPut(p, a, r, g, b, mode) {
try {
if (mode === "argb") { 
p.setColorValue(a, r, g, b, true);
}
else {
p.setColorValue(r, g, b, a, true);
}
return true;
} catch (e1) {
}
try {
if (mode === "argb") { 
p.setColorValue(a, r, g, b);
}
else {
p.setColorValue(r, g, b, a);
}
return true;
} catch (e2) {
}
return false;
}
function _fsScIdxNear(vals, want) {
var best = -1;
var bd = 26;
for (var i = 0; i < vals.length; i += 1) { 
var d = Math.abs(vals[i] - want);
if (d < bd) { 
bd = d;
best = i;
}}
return best;
}
function _fsScFromRaw(raw, cal) {
function _c(x) {
x = Math.round(x * cal.scale);
if (x < 0) { 
x = 0;
}
if (x > 255) { 
x = 255;
}
return x;
}
if (!raw) { 
return null;
}
if (raw.hex) { 
return {a: 255, b: parseInt(raw.hex.substring(4, 6), 16), g: parseInt(raw.hex.substring(2, 4), 16), r: parseInt(raw.hex.substring(0, 2), 16)};
}
if (!cal) { 
return null;
}
var a = 255;
if (raw.arr.length > 3) { 
var used = {};
used["" + cal.iR] = 1;
used["" + cal.iG] = 1;
used["" + cal.iB] = 1;
for (var i = 0; i < raw.arr.length; i += 1) { 
if (!used["" + i]) { 
a = _c(raw.arr[i]);
break ;
}}
}
return {a: a, b: _c(raw.arr[cal.iB]), g: _c(raw.arr[cal.iG]), r: _c(raw.arr[cal.iR])};
}
function _fsScCalibrate(p) {
if (_FS_SC_CAL) { 
return _FS_SC_CAL;
}
var raw0 = _fsScRawColor(p);
if (!raw0) { 
return null;
}
if (raw0.hex) { 
_FS_SC_CAL = {hex: true};
return _FS_SC_CAL;
}
var modes = ["argb", "rgba"];
var escreveuSonda = false;
for (var m = 0; m < modes.length; m += 1) { 
if (!_fsScPut(p, 180, 200, 100, 50, modes[m])) { 
continue ;
}
escreveuSonda = true;
var raw1 = _fsScRawColor(p);
if ((!raw1) || (!raw1.arr)) { 
continue ;
}
var mx = 0;
for (var q = 0; q < raw1.arr.length; q += 1) { 
if (raw1.arr[q] > mx) { 
mx = raw1.arr[q];
}}
var sc = mx <= 1.0001 ? 255 : 1;
var vals = [];
for (var w = 0; w < raw1.arr.length; w += 1) { 
vals.push(raw1.arr[w] * sc);}
var iR = _fsScIdxNear(vals, 200);
var iG = _fsScIdxNear(vals, 100);
var iB = _fsScIdxNear(vals, 50);
if ((((((iR >= 0) && (iG >= 0)) && (iB >= 0)) && (iR !== iG)) && (iG !== iB)) && (iR !== iB)) { 
var cal = {hex: false, iB: iB, iG: iG, iR: iR, mode: modes[m], scale: sc};
var back = _fsScFromRaw(raw0, cal);
if (back) { 
_fsScPut(p, back.a, back.r, back.g, back.b, cal.mode);
}
var raw2 = _fsScRawColor(p);
if (!(((raw2) && (raw2.arr)) && (_fsScMesmoValor(raw2.arr, raw0.arr)))) { 
if (!_fsScEchoRestore(p, raw0)) { 
_fsScFerido(p, "calibragem");
}
}
_FS_SC_CAL = cal;
return cal;
}}
if (escreveuSonda) { 
if (!_fsScEchoRestore(p, raw0)) { 
_fsScFerido(p, "calibragem");
}
}
return null;
}
function _fsScReadColor(p) {
var cal = _fsScCalibrate(p);
var raw = _fsScRawColor(p);
if ((raw) && (raw.hex)) { 
return {a: 255, b: parseInt(raw.hex.substring(4, 6), 16), g: parseInt(raw.hex.substring(2, 4), 16), r: parseInt(raw.hex.substring(0, 2), 16)};
}
if (!cal) { 
return null;
}
return _fsScFromRaw(raw, cal);
}
function _fsScWriteColor(p, c) {
if (!c) { 
return false;
}
var cal = _fsScCalibrate(p);
if (!cal) { 
return false;
}
var rawAntes = _fsScRawColor(p);
var prev = _fsScFromRaw(rawAntes, cal);
if (!_fsScPut(p, c.a, c.r, c.g, c.b, (cal.mode) || ("argb"))) { 
return false;
}
var now = _fsScReadColor(p);
if (now) { 
var d = Math.abs(now.r - c.r) + Math.abs(now.g - c.g) + Math.abs(now.b - c.b);
if (d > 6) { 
if (!_fsScEchoRestore(p, rawAntes)) { 
if (prev) { 
_fsScPut(p, prev.a, prev.r, prev.g, prev.b, (cal.mode) || ("argb"));
}
_fsScFerido(p, "escrita");
}
return false;
}
}
return true;
}
function _fsScWalk(props, groups, out) {
var n = 0;
try {
n = props.numItems;
} catch (e) {return;
}
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = props[i];
} catch (eP) {continue ;
}
if (!p) { 
continue ;
}
var name = "";
try {
name = (p.displayName) || ("");
} catch (eN) {
}
var kids = 0;
try {
kids = (p.numItems) || (0);
} catch (eK) {kids = 0;
}
if (kids > 0) { 
_fsScWalk(p, groups.concat([name]), out);
continue ;
}
try {
v = p.getValue();
} catch (eV) {v = undefined;
}
if (_fsScIsColorProp(p, name, v)) { 
var cv = _fsScReadColor(p);
if (cv) { 
out.push({color: cv, groups: groups, isColor: true, name: name, prop: p});
continue ;
}
}
var t = typeof v;
if ((t === "undefined") || (t === "function")) { 
continue ;
}
out.push({groups: groups, name: name, prop: p, text: _fsScIsTextVal(v), value: v});}
if ((!groups) || (!groups.length)) { 
_fsScNumerarLinhas(out);
}
}
function _fsScRunsDoDestino(valDest, nRuns) {
if ((valDest === null) || (valDest === undefined)) { 
return null;
}
var base = valDest;
if ((typeof valDest !== "string") && (typeof valDest.length === "number")) { 
if (!valDest.length) { 
return null;
}
base = valDest[0];
}
var out = [];
for (var i = 0; i < nRuns; i += 1) { 
out.push(base);}
return out;
}
function _fsScApply(prop, srcValue, isText, withColor, withFont) {
if (isText) { 
try {
cur = prop.getValue();
} catch (e) {return false;
}
if (!_fsScIsTextVal(cur)) { 
return false;
}
var curObj = null;
var srcObj = null;
try {
curObj = _fsJSON.parse(cur);
} catch (e1) {return false;
}
try {
srcObj = _fsJSON.parse(srcValue);
} catch (e2) {return false;
}
if ((!curObj) || (!srcObj)) { 
return false;
}
srcObj.textEditValue = curObj.textEditValue;
if (!withColor) { 
for (var k in curObj) { 
if (/colou?r/i.test(k)) { 
srcObj[k] = curObj[k];
}
}
}
var nRuns = 1;
try {
if ((srcObj.fontEditValue) && (srcObj.fontEditValue.length)) { 
nRuns = srcObj.fontEditValue.length;
}
else {
if ((srcObj.fontTextRunLength) && (srcObj.fontTextRunLength.length)) { 
nRuns = srcObj.fontTextRunLength.length;
}
}
} catch (eRn) {
}
for (var cf = 0; cf < _FS_SC_CAMPOS_FONTE.length; cf += 1) { 
var kf = _FS_SC_CAMPOS_FONTE[cf];
var refeito = _fsScRunsDoDestino(curObj[kf], nRuns);
if (refeito !== null) { 
srcObj[kf] = refeito;
}}
try {
_fsNormalizeRuns(srcObj);
} catch (e3) {
}
var _escreveu = false;
try {
prop.setValue(_fsJSON.stringify(srcObj), true);
_escreveu = true;
} catch (e4) {
}
if (!_escreveu) { 
try {
prop.setValue(_fsJSON.stringify(srcObj));
_escreveu = true;
} catch (e5) {
}
}
if (!_escreveu) { 
return false;
}
return true;
}
try {
prop.setValue(srcValue, true);
return true;
} catch (eA) {
}
try {
prop.setValue(srcValue);
return true;
} catch (eB) {
}
return false;
}
function _fsScTargets(seq, scope) {
var res = [];
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var locked = false;
try {
locked = tr.isLocked();
} catch (eL) {
}
if (locked) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
if (scope === "selected") { 
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
}
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (mgt) { 
res.push({clip: cl, mgt: mgt});
}}}
return res;
}
function _fsScColorKind(name, groups) {
var s = ((groups) || ([]).join(" ") + " " + (name) || ("")).toLowerCase();
if ((s.indexOf("shadow") !== -1) || (s.indexOf("sombra") !== -1)) { 
return "shadow";
}
if (((((s.indexOf("stroke") !== -1) || (s.indexOf("contorno") !== -1)) || (s.indexOf("outline") !== -1)) || (s.indexOf("borda") !== -1)) || (s.indexOf("border") !== -1)) { 
return "stroke";
}
if ((s.indexOf("glow") !== -1) || (s.indexOf("brilho") !== -1)) { 
return "glow";
}
if ((((s.indexOf("fundo") !== -1) || (s.indexOf("background") !== -1)) || (s.indexOf("caixa") !== -1)) || (s.indexOf("box") !== -1)) { 
return "bg";
}
return "text";
}
function _fsScIsSizeName(n, groups) {
var tudo = ((groups) || ([]).join(" ") + " " + (n) || ("")).toLowerCase();
var deco = ((((((tudo.indexOf("shadow") !== -1) || (tudo.indexOf("sombra") !== -1)) || (tudo.indexOf("glow") !== -1)) || (tudo.indexOf("stroke") !== -1)) || (tudo.indexOf("borda") !== -1)) || (tudo.indexOf("box") !== -1)) || (tudo.indexOf("caixa") !== -1);
if (deco) { 
return false;
}
var s2 = (n) || ("").toLowerCase();
var temTam = (s2.indexOf("size") !== -1) || (s2.indexOf("tamanho") !== -1);
if (!temTam) { 
return false;
}
if (((s2.indexOf("font") !== -1) || (s2.indexOf("fonte") !== -1)) || (s2.indexOf("text") !== -1)) { 
return true;
}
var exato = s2.replace(/[^a-z]/g, "");
return (exato === "size") || (exato === "tamanho");
}
function _fsScIsTimeName(n) {
var s = (n) || ("").toLowerCase();
return (((s.indexOf("time") !== -1) || (s.indexOf("tempo") !== -1)) || (s.indexOf("delay") !== -1)) || (s.indexOf("atraso") !== -1);
}
function fsStyleCopy() {
try {
_FS_SC_FERIDOS = [];
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var src = null;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (mgt) { 
src = {clip: cl, mgt: mgt};
break ;
}}
if (src) { 
break ;
}}
if (!src) { 
return _fsJSON.stringify({error: "Selecione na timeline a legenda que tem o estilo que voc\xea quer copiar (precisa ser um bloco de legenda do Frame Speed)."});
}
var leaves = [];
_fsScWalk(src.mgt.properties, [], leaves);
if (!leaves.length) { 
return _fsJSON.stringify({error: "N\xe3o consegui ler os par\xe2metros dessa legenda."});
}
var items = [];
var groupsSeen = {};
var nText = 0;
var nColor = 0;
var nPos = 0;
var nTime = 0;
for (var i = 0; i < leaves.length; i += 1) { 
var lf = leaves[i];
var it = {groups: lf.groups, linha: lf.linha, name: lf.name};
if (lf.isColor) { 
it.isColor = true;
it.color = lf.color;
nColor++;
}
else {
it.value = lf.value;
it.text = !(!lf.text);
if (lf.text) { 
nText++;
}
}
if (_fsScIsPosName(lf.name)) { 
nPos++;
}
if ((!lf.isColor) && (_fsScIsTimeName(lf.name))) { 
nTime++;
}
items.push(it);
for (var g = 0; g < lf.groups.length; g += 1) { 
if (lf.groups[g]) { 
groupsSeen[lf.groups[g]] = 1;
}}}
var gList = [];
for (var gk in groupsSeen) { 
gList.push(gk);
}
var byName = {};
var maxRep = 0;
for (var q = 0; q < items.length; q += 1) { 
var nm2 = (items[q].name) || ("");
byName[nm2] = (byName[nm2]) || (0) + 1;
if (byName[nm2] > maxRep) { 
maxRep = byName[nm2];
}}
var cname = "";
try {
cname = src.clip.name;
} catch (eN) {
}
var motion = [];
var motionCompAchado = 0;
try {
var _cp = _fsAchaCompMovimento(src.clip);
if (_cp) { 
motionCompAchado = 1;
var _mps = _cp.properties;
for (var _mp = 0; _mp < _mps.numItems; _mp += 1) { 
var _pr = null;
try {
_pr = _mps[_mp];
} catch (eMp) {continue ;
}
if (!_pr) { 
continue ;
}
var _pmn = "";
var _pdn = "";
try {
_pmn = String(_pr.matchName);
} catch (e1m) {
}
try {
_pdn = String(_pr.displayName);
} catch (e2m) {
}
try {
_pv = _pr.getValue();
} catch (e3m) {continue ;
}
var _tv = typeof _pv;
if (((_tv !== "number") && (_tv !== "boolean")) && (!(((_pv !== null) && (_pv !== undefined)) && (typeof _pv.length === "number")))) { 
continue ;
}
motion.push({idx: _mp, mn: _pmn, name: _pdn, value: _pv});}
}
} catch (eMo) {
}
return _fsJSON.stringify({colorProps: nColor, count: items.length, feridos: _FS_SC_FERIDOS, groups: gList, items: items, motion: motion, motionComp: motionCompAchado, ok: true, posProps: nPos, repeats: maxRep, template: cname, textProps: nText, timeProps: nTime});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsScLineNum(nm, groups) {
var m = String((nm) || ("")).match(/(\d+)/);
if (m) { 
return parseInt(m[1], 10);
}
var gs = "";
try {
gs = (groups) || ([]).join(" ");
} catch (eG) {
}
m = String(gs).match(/(\d+)/);
if (m) { 
return parseInt(m[1], 10);
}
return 1;
}
function _fsScNumerarLinhas(leaves) {
var atual = 1;
var textos = 0;
for (var i = 0; i < leaves.length; i += 1) { 
var lf = leaves[i];
if (!lf) { 
continue ;
}
var nm = String((lf.name) || (""));
var gs = "";
try {
gs = (lf.groups) || ([]).join(" ");
} catch (eG) {gs = "";
}
var m = nm.match(/(\d+)/);
var n = m ? parseInt(m[1], 10) : 0;
var doGrupo = false;
if (!n) { 
var mg = String(gs).match(/(\d+)/);
if (mg) { 
n = parseInt(mg[1], 10);
doGrupo = true;
}
}
if ((lf.text) && (!lf.isColor)) { 
textos++;
atual = (n) || (textos);
lf.linha = atual;
continue ;
}
if (n) { 
if ((doGrupo) || (/text|texto/i.test(nm))) { 
atual = n;
}
lf.linha = n;
continue ;
}
lf.linha = atual;}
}
function _fsScLinhaDe(lf) {
if (((lf) && (typeof lf.linha === "number")) && (lf.linha > 0)) { 
return lf.linha;
}
return _fsScLineNum(lf ? lf.name : "", lf ? lf.groups : null);
}
function fsStylePaste(styleJson, scope, includePos, includeColor, colorMode, includeTime, includeFont) {
try {
function _score(nm, field) {
if (!perName[nm]) { 
perName[nm] = {fail: 0, miss: 0, ok: 0};
}
perName[nm][field]++;
}
_FS_SC_FERIDOS = [];
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var style = null;
try {
style = _fsJSON.parse(styleJson);
} catch (eP) {
}
if (((!style) || (!style.items)) || (!style.items.length)) { 
return _fsJSON.stringify({error: "Nenhum estilo copiado. Copie de uma legenda primeiro."});
}
var wantPos = ((includePos === 1) || (includePos === true)) || (includePos === "1");
var wantColor = ((includeColor === 1) || (includeColor === true)) || (includeColor === "1");
var _modo = String((colorMode) || ("line"));
if (_modo === "auto") { 
var _linhasComCor = {};
var _nLinhas = 0;
for (var _ci = 0; _ci < style.items.length; _ci += 1) { 
var _it = style.items[_ci];
if ((!_it) || (!_it.isColor)) { 
continue ;
}
var _ln = _fsScLinhaDe(_it);
if (!_linhasComCor[_ln]) { 
_linhasComCor[_ln] = 1;
_nLinhas++;
}}
colorAll = _nLinhas <= 1;
}
else {
colorAll = _modo === "all";
}
var wantTime = ((includeTime === 1) || (includeTime === true)) || (includeTime === "1");
var wantFont = !(((includeFont === 0) || (includeFont === false)) || (includeFont === "0"));
var _fontesOrigem = [];
var _fontePorLinha = {};
if (wantFont) { 
try {
for (var _fi = 0; _fi < style.items.length; _fi += 1) { 
var _si = style.items[_fi];
if (((!_si) || (!_si.text)) || (typeof _si.value !== "string")) { 
continue ;
}
if (_si.value.indexOf("fontEditValue") === -1) { 
continue ;
}
var _fo = _fsJSON.parse(_si.value);
if (((!_fo) || (!_fo.fontEditValue)) || (!_fo.fontEditValue.length)) { 
continue ;
}
var _psO = typeof _fo.fontEditValue === "string" ? _fo.fontEditValue : String(_fo.fontEditValue[0]);
if (!_psO) { 
continue ;
}
var _lnO = _fsScLinhaDe(_si);
if (_fontePorLinha[_lnO]) { 
continue ;
}
var _fnt = {family: (_fo.fontFamilyName) && (_fo.fontFamilyName.length) ? typeof _fo.fontFamilyName === "string" ? _fo.fontFamilyName : String(_fo.fontFamilyName[0]) : "", linha: _lnO, ps: _psO, style: (_fo.fontStyleName) && (_fo.fontStyleName.length) ? typeof _fo.fontStyleName === "string" ? _fo.fontStyleName : String(_fo.fontStyleName[0]) : ""};
_fontePorLinha[_lnO] = _fnt;
_fontesOrigem.push(_fnt);}
} catch (eFo) {_fontesOrigem = [];
_fontePorLinha = {};
}
}
var _fonteOrigem = _fontesOrigem.length ? _fontesOrigem[0] : null;
_FS_SC_FONTE = {exemplo: "", ok: 0, pedidas: 0, recusadas: 0, semCampo: 0};
var targets = _fsScTargets(seq, scope);
if (!targets.length) { 
return _fsJSON.stringify({error: scope === "selected" ? "Nenhuma legenda selecionada na timeline. Selecione as legendas que devem receber o estilo." : "Nenhum bloco de legenda encontrado nas trilhas destravadas."});
}
var srcGroups = {};
var order = [];
var skippedPos = 0;
var skippedColor = 0;
var skippedTime = 0;
var skippedSize = 0;
for (var si = 0; si < style.items.length; si += 1) { 
var it = style.items[si];
if ((!wantPos) && (_fsScIsPosName(it.name))) { 
skippedPos++;
continue ;
}
if ((!wantColor) && (it.isColor)) { 
skippedColor++;
continue ;
}
if (((!wantTime) && (!it.isColor)) && (_fsScIsTimeName(it.name))) { 
skippedTime++;
continue ;
}
if ((!it.isColor) && (_fsScIsSizeName(it.name, it.groups))) { 
skippedSize++;
continue ;
}
var nm = (it.name) || ("");
if (it.isColor) { 
gk = colorAll ? "C:" + _fsScColorKind(nm, it.groups) : "L:" + _fsScColorKind(nm, it.groups) + ":" + _fsScLinhaDe(it);
}
else {
gk = "K:" + _fsScKey(nm);
}
if (!srcGroups[gk]) { 
srcGroups[gk] = {items: [], key: gk, name: nm};
order.push(gk);
}
srcGroups[gk].items.push(it);}
_fsScExpandeLinhas(srcGroups, order);
var modoCorUsado = colorAll ? "all" : "line";
var clipsOk = 0;
var applied = 0;
var notFound = 0;
var failed = 0;
var colorApplied = 0;
var colorFailed = 0;
var textoPorLinha = 0;
var perName = {};
for (var ti = 0; ti < targets.length; ti += 1) { 
var props = null;
try {
props = targets[ti].mgt.properties;
} catch (eProps) {continue ;
}
if (!props) { 
continue ;
}
var tLeaves = [];
_fsScWalk(props, [], tLeaves);
var tgtGroups = {};
for (var tl = 0; tl < tLeaves.length; tl += 1) { 
var tn = (tLeaves[tl].name) || ("");
var kN = "N:" + tn;
if (!tgtGroups[kN]) { 
tgtGroups[kN] = [];
}
tgtGroups[kN].push(tLeaves[tl]);
var tk = _fsScKey(tn);
if (tk) { 
var kK = "K:" + tk;
if (!tgtGroups[kK]) { 
tgtGroups[kK] = [];
}
tgtGroups[kK].push(tLeaves[tl]);
}
if (tLeaves[tl].text) { 
var kT = "T:" + _fsScLinhaDe(tLeaves[tl]);
if (!tgtGroups[kT]) { 
tgtGroups[kT] = [];
}
tgtGroups[kT].push(tLeaves[tl]);
}
if (tLeaves[tl].isColor) { 
var kC = "C:" + _fsScColorKind(tn, tLeaves[tl].groups);
if (!tgtGroups[kC]) { 
tgtGroups[kC] = [];
}
tgtGroups[kC].push(tLeaves[tl]);
var kL = "L:" + _fsScColorKind(tn, tLeaves[tl].groups) + ":" + _fsScLinhaDe(tLeaves[tl]);
if (!tgtGroups[kL]) { 
tgtGroups[kL] = [];
}
tgtGroups[kL].push(tLeaves[tl]);
}}
var okHere = 0;
for (var oi = 0; oi < order.length; oi += 1) { 
var grp = srcGroups[order[oi]];
var sList = grp.items;
var name = grp.name;
var tList = tgtGroups[grp.key];
if ((!tList) || (!tList.length)) { 
if ((sList[0]) && (sList[0].text)) { 
var casouTexto = 0;
for (var st = 0; st < sList.length; st += 1) { 
var lT = tgtGroups["T:" + _fsScLinhaDe(sList[st])];
if ((!lT) || (!lT.length)) { 
continue ;
}
for (var kt = 0; kt < lT.length; kt += 1) { 
if ((!lT[kt].prop) || (lT[kt].isColor)) { 
continue ;
}
if (_fsScApply(lT[kt].prop, sList[st].value, true, wantColor, wantFont)) { 
applied++;
okHere++;
casouTexto++;
textoPorLinha++;
_score(name, "ok");
}
else {
failed++;
_score(name, "fail");
}}}
if (casouTexto) { 
continue ;
}
}
if (!grp.sintetico) { 
notFound += sList.length;
_score(name, "miss");
}
continue ;
}
for (var k = 0; k < tList.length; k += 1) { 
var sIt = sList.length === 1 ? sList[0] : k < sList.length ? sList[k] : sList[sList.length - 1];
var tgt = tList[k];
if (!tgt.prop) { 
continue ;
}
if (sIt.isColor) { 
if (!tgt.isColor) { 
notFound++;
_score(name, "miss");
continue ;
}
if (_fsScWriteColor(tgt.prop, sIt.color)) { 
applied++;
colorApplied++;
okHere++;
_score(name, "ok");
}
else {
failed++;
colorFailed++;
_score(name, "fail");
}
continue ;
}
if (tgt.isColor) { 
continue ;
}
if (_fsScApply(tgt.prop, sIt.value, sIt.text, wantColor, wantFont)) { 
applied++;
okHere++;
_score(name, "ok");
}
else {
failed++;
_score(name, "fail");
}}}
if ((wantFont) && (_fontesOrigem.length)) { 
for (var _tt = 0; _tt < tLeaves.length; _tt += 1) { 
var _tl = tLeaves[_tt];
if ((((!_tl) || (!_tl.text)) || (!_tl.prop)) || (_tl.isColor)) { 
continue ;
}
var _lnT = _fsScLinhaDe(_tl);
var _fnt = (_fontePorLinha[_lnT]) || (null);
if (!_fnt) { 
for (var _q = _lnT - 1; (_q >= 1) && (!_fnt); _q--) { 
if (_fontePorLinha[_q]) { 
_fnt = _fontePorLinha[_q];
}}
}
if (!_fnt) { 
_fnt = _fontesOrigem[0];
}
_FS_SC_FONTE.pedidas++;
var _fok = false;
try {
_fok = _fsScFonteNaProp(_tl.prop, _fnt.ps, _fnt.family, _fnt.style);
} catch (eSbf) {_fok = false;
}
if (!_fok) { 
_FS_SC_FONTE.semCampo++;
continue ;
}
var _conf = null;
try {
var _lo = _fsJSON.parse(_tl.prop.getValue());
if (((_lo) && (_lo.fontEditValue)) && (_lo.fontEditValue.length)) { 
_conf = typeof _lo.fontEditValue === "string" ? _lo.fontEditValue : String(_lo.fontEditValue[0]);
}
} catch (eCf) {_conf = null;
}
var _alvo = _fnt.ps.indexOf(" ") !== -1 ? _fnt.ps.replace(/\s+/g, "-") : _fnt.ps;
if (_conf === null) { 
_FS_SC_FONTE.semCampo++;
}
else if (_conf === _alvo) {
_FS_SC_FONTE.ok++;
}
else {
_FS_SC_FONTE.recusadas++;
_FS_SC_FONTE.exemplo = _alvo + " -> " + _conf;
}}
}
if (okHere > 0) { 
clipsOk++;
}}
var res = {applied: applied, clips: targets.length, clipsOk: clipsOk, colorApplied: colorApplied, colorFailed: colorFailed, failed: failed, feridos: _FS_SC_FERIDOS, fonteExemplo: _FS_SC_FONTE.exemplo, fonteOk: _FS_SC_FONTE.ok, fontePedidas: _FS_SC_FONTE.pedidas, fonteRecusadas: _FS_SC_FONTE.recusadas, fonteSemCampo: _FS_SC_FONTE.semCampo, modoCor: modoCorUsado, notFound: notFound, ok: true, skippedColor: skippedColor, skippedPos: skippedPos, skippedSize: skippedSize, skippedTime: skippedTime, textoPorLinha: textoPorLinha};
var probs = [];
for (var pn in perName) { 
var sc = perName[pn];
if ((sc.miss > 0) || (sc.fail > 0)) { 
probs.push({fail: sc.fail, miss: sc.miss, name: pn, ok: sc.ok});
}
}
var motionOk = 0;
var motionFail = 0;
var motionSemCampo = 0;
var motionRecusou = 0;
var motionIgnorou = 0;
var motionSemLeitura = 0;
var motionSemComp = 0;
var motionForma = 0;
var motionDesanimou = 0;
var motionExemplo = "";
if (((wantPos) && (style.motion)) && (style.motion.length)) { 
for (var _mt = 0; _mt < targets.length; _mt += 1) { 
var _alvoComp = _fsAchaCompMovimento(targets[_mt].clip);
if (!_alvoComp) { 
motionSemComp++;
continue ;
}
var _tps = _alvoComp.properties;
var _usados = {};
for (var _sm = 0; _sm < style.motion.length; _sm += 1) { 
function _pega(c, como) {
_dst2 = c.p;
_atual = c.atual;
_comoAchou = como;
_idxUsado = c.idx;
_usados[c.idx] = 1;
}
var _src2 = style.motion[_sm];
var _cands = [];
for (var _tp = 0; _tp < _tps.numItems; _tp += 1) { 
var _p3 = null;
try {
_p3 = _tps[_tp];
} catch (eP3) {continue ;
}
if (!_p3) { 
continue ;
}
var _leu3 = false;
try {
_v3 = _p3.getValue();
_leu3 = true;
} catch (eV3) {
}
if (!_leu3) { 
continue ;
}
if (_fsScForma(_v3) !== _fsScForma(_src2.value)) { 
continue ;
}
if (_usados[_tp]) { 
continue ;
}
var _m3 = "";
var _d3 = "";
try {
_m3 = String(_p3.matchName);
} catch (eM3) {
}
try {
_d3 = String(_p3.displayName);
} catch (eD3) {
}
_cands.push({atual: _v3, dn: _d3, idx: _tp, mn: _m3, p: _p3});}
var _dst2 = null;
var _atual = null;
var _comoAchou = "";
var _idxUsado = -1;
for (var _k1 = 0; (!_dst2) && (_k1 < _cands.length); _k1++) { 
if (((_cands[_k1].dn) && (_src2.name)) && (_fsSemAcento(_cands[_k1].dn) === _fsSemAcento(_src2.name))) { 
_pega(_cands[_k1], "nome");
}}
for (var _k2 = 0; (!_dst2) && (_k2 < _cands.length); _k2++) { 
if (((_cands[_k2].mn) && (_src2.mn)) && (_cands[_k2].mn === _src2.mn)) { 
_pega(_cands[_k2], "match");
}}
for (var _k3 = 0; (!_dst2) && (_k3 < _cands.length); _k3++) { 
if (_cands[_k3].idx === _src2.idx) { 
_pega(_cands[_k3], "indice");
}}
if ((!_dst2) && (_cands.length === 1)) { 
_pega(_cands[0], "unico");
}
if (!_dst2) { 
motionFail++;
if (_cands.length) { 
motionSemCampo++;
}
else {
motionForma++;
if (!motionExemplo) { 
motionExemplo = ((_src2.name) || (_src2.mn)) || ("propriedade " + _src2.idx) + ": a origem tem " + _fsScForma(_src2.value) + " e nenhuma propriedade do destino tem essa forma";
}
}
continue ;
}
var _tinhaChave = false;
try {
_tinhaChave = !(!_dst2.isTimeVarying());
} catch (eTv) {
}
if (_tinhaChave) { 
try {
_dst2.setTimeVarying(false);
motionDesanimou++;
} catch (eTv2) {
}
}
var _escreveu = false;
try {
_dst2.setValue(_src2.value, true);
_escreveu = true;
} catch (eS3) {
}
if (!_escreveu) { 
try {
_dst2.setValue(_src2.value);
_escreveu = true;
} catch (eS4) {
}
}
if (!_escreveu) { 
motionFail++;
motionRecusou++;
continue ;
}
var _leu = false;
var _refeito = null;
try {
_refeito = _tps[_idxUsado];
} catch (eRf) {_refeito = null;
}
if (!_refeito) { 
_refeito = _dst2;
}
try {
_lido = _refeito.getValue();
_leu = true;
} catch (eR3) {
}
if (!_leu) { 
motionSemLeitura++;
motionOk++;
}
else if (_fsScMesmoValor(_lido, _src2.value)) {
motionOk++;
}
else {
motionFail++;
motionIgnorou++;
if (!motionExemplo) { 
motionExemplo = ((_src2.name) || (_src2.mn)) || ("?") + ": pedi " + _fsJSON.stringify(_src2.value) + " e ficou " + _fsJSON.stringify(_lido);
}
}}}
res.motionOk = motionOk;
res.motionFail = motionFail;
res.motionSemCampo = motionSemCampo;
res.motionSemComp = motionSemComp;
res.motionForma = motionForma;
res.motionDesanimou = motionDesanimou;
res.motionRecusou = motionRecusou;
res.motionIgnorou = motionIgnorou;
res.motionSemLeitura = motionSemLeitura;
res.motionExemplo = motionExemplo;
}
res.problems = probs;
if (colorFailed > 0) { 
res.warning = colorFailed + " cor(es) n\xe3o puderam ser gravadas nesses templates \u2014 a cor original de cada legenda foi mantida.";
}
else {
if ((notFound > 0) || (failed > 0)) { 
res.warning = "Alguns par\xe2metros n\xe3o existem (ou n\xe3o puderam ser gravados) nos blocos de destino \u2014 normal quando os templates s\xe3o diferentes.";
}
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsScKey(name) {
var s = (name) || ("").toLowerCase();
s = s.replace(/[\u00e1\u00e0\u00e2\u00e3\u00e4]/g, "a");
s = s.replace(/[\u00e9\u00e8\u00ea\u00eb]/g, "e");
s = s.replace(/[\u00ed\u00ec\u00ee\u00ef]/g, "i");
s = s.replace(/[\u00f3\u00f2\u00f4\u00f5\u00f6]/g, "o");
s = s.replace(/[\u00fa\u00f9\u00fb\u00fc]/g, "u");
s = s.replace(/\u00e7/g, "c");
s = s.replace(/[^a-z0-9]+/g, " ");
s = s.replace(/\b\d+\b/g, " ");
s = s.replace(/([a-z])\d+\b/g, "$1");
s = s.replace(/\s+/g, " ");
s = s.replace(/^ +/, "").replace(/ +$/, "");
s = s.replace(/\bpositon\b/g, "position");
s = s.replace(/\bdirection\b/g, "angle");
var w = s.split(" ");
var lim = [];
for (var wi = 0; wi < w.length; wi += 1) { 
if (w[wi] !== "") { 
lim.push(w[wi]);
}}
for (var ri = 0; ri < lim.length; ri += 1) { 
for (var rj = ri + 1; rj < lim.length; rj++) { 
if (lim[ri] === lim[rj]) { 
lim.splice(ri, 1);
ri--;
break ;
}}}
lim.sort();
return lim.join(" ");
}
function fsStyleDumpParams() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return "Nenhuma sequencia ativa.";
}
var src = null;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (mgt) { 
src = {clip: cl, mgt: mgt};
break ;
}}
if (src) { 
break ;
}}
if (!src) { 
return "Selecione um bloco de legenda na timeline primeiro.";
}
var leaves = [];
_fsScWalk(src.mgt.properties, [], leaves);
var out = [];
var nm = "";
try {
nm = src.clip.name;
} catch (eN) {
}
out.push("=== " + nm + " \u2014 " + leaves.length + " parametros ===");
for (var i = 0; i < leaves.length; i += 1) { 
var lf = leaves[i];
var g = (lf.groups) && (lf.groups.length) ? lf.groups.join(" > ") : "(raiz)";
var tipo = lf.isColor ? "COR" : lf.text ? "TEXTO" : "valor";
out.push(g + " > " + lf.name + "   [" + tipo + "]   chave=" + _fsScKey(lf.name));
if (tipo === "TEXTO") { 
var _tv = "";
try {
_tv = String((lf.value) || (""));
} catch (eTv) {
}
var _temFonte = _tv.indexOf("fontEditValue") !== -1;
out.push("      fonte no blob: " + _temFonte ? "SIM" : "NAO");
if (_temFonte) { 
try {
var _to = _fsJSON.parse(_tv);
out.push("      fontEditValue .. " + _fsJSON.stringify(_to.fontEditValue));
out.push("      fontFamilyName . " + _fsJSON.stringify(_to.fontFamilyName));
out.push("      fontStyleName .. " + _fsJSON.stringify(_to.fontStyleName));
out.push("      runs (texto) ... " + _fsJSON.stringify(_to.fontTextRunLength));
} catch (eTo) {out.push("      (nao consegui ler o blob: " + eTo + ")");
}
}
else {
out.push("      >> sem fontEditValue: este modelo NAO carrega fonte no texto.");
out.push("      >> nenhum metodo de copia vai transferir fonte aqui \u2014 o .mogrt");
out.push("      >> precisa ser reexportado do After com a fonte exposta.");
}
}}
out.push("");
out.push("=== MOVIMENTO (Effect Controls) ===");
var _dc = null;
try {
_dc = _fsAchaCompMovimento(src.clip);
} catch (eDc) {
}
if (!_dc) { 
out.push("NAO ACHEI o componente Movimento neste clipe.");
out.push("Componentes que o clipe tem:");
try {
var _cs = src.clip.components;
for (var _ci = 0; _ci < _cs.numItems; _ci += 1) { 
var _cc = _cs[_ci];
var _cdn = "";
var _cmn2 = "";
try {
_cdn = String(_cc.displayName);
} catch (e1) {
}
try {
_cmn2 = String(_cc.matchName);
} catch (e2) {
}
out.push("  [" + _ci + "] nome=" + _fsJSON.stringify(_cdn) + " match=" + _fsJSON.stringify(_cmn2));}
} catch (eCs) {out.push("  (nao consegui listar: " + eCs + ")");
}
}
else {
var _dcn = "";
var _dcm = "";
try {
_dcn = String(_dc.displayName);
} catch (e3) {
}
try {
_dcm = String(_dc.matchName);
} catch (e4) {
}
out.push("componente: nome=" + _fsJSON.stringify(_dcn) + " match=" + _fsJSON.stringify(_dcm));
var _dps = null;
try {
_dps = _dc.properties;
} catch (eDp) {
}
if (!_dps) { 
out.push("(o componente nao expoe properties)");
}
else {
out.push("propriedades: " + _dps.numItems);
for (var _dp = 0; _dp < _dps.numItems; _dp += 1) { 
var _p = null;
try {
_p = _dps[_dp];
} catch (eDd) {out.push("  [" + _dp + "] (nao consegui ler)");
continue ;
}
var _pn = "";
var _pm = "";
var _pv = "(sem valor)";
var _pf = "?";
var _pk = "?";
try {
_pn = String(_p.displayName);
} catch (e5) {
}
try {
_pm = String(_p.matchName);
} catch (e6) {
}
try {
_pv = _fsJSON.stringify(_p.getValue());
} catch (e7) {_pv = "(getValue estourou: " + e7 + ")";
}
try {
_pf = _fsScForma(_p.getValue());
} catch (e8) {
}
try {
_pk = String(_p.isTimeVarying());
} catch (e9) {_pk = "(sem isTimeVarying)";
}
out.push("  [" + _dp + "] nome=" + _fsJSON.stringify(_pn) + " match=" + _fsJSON.stringify(_pm) + " forma=" + _pf + " chaves=" + _pk);
out.push("        valor=" + _pv);}
}
}
return out.join("\n");
} catch (e) {return "Erro: " + e.toString();
}
}
function _fsFxIsIntrinsic(mn) {
var s = (mn) || ("").toLowerCase();
return (((((s.indexOf("motion") !== -1) || (s.indexOf("opacity") !== -1)) || (s.indexOf("timeremap") !== -1)) || (s.indexOf("time remapping") !== -1)) || (s.indexOf("volume") !== -1)) || (s.indexOf("audiolevels") !== -1);
}
function _fsFxPorque(mapa, motivo, nome) {
if (!mapa[motivo]) { 
mapa[motivo] = {n: 0, nomes: []};
}
mapa[motivo].n++;
if (mapa[motivo].nomes.length < 3) { 
mapa[motivo].nomes.push(String((nome) || ("?")));
}
}
function _fsFxNormNome(t) {
var x = String((t) || ("")).toLowerCase();
try {
x = _fsSemAcento(x);
} catch (eA) {
}
return x.replace(/[^a-z0-9]/g, "");
}
function _fsFxListaEfeitos(kind) {
var qs = null;
try {
qs = qe.project;
} catch (e) {return [];
}
if (!qs) { 
return [];
}
var bruto = null;
try {
bruto = kind === "a" ? qs.getAudioEffectList() : qs.getVideoEffectList();
} catch (e2) {bruto = null;
}
if (!bruto) { 
return [];
}
var out = [];
var n = 0;
try {
n = bruto.length;
} catch (e3) {n = 0;
}
for (var i = 0; i < n; i += 1) { 
var it = bruto[i];
var nome = "";
try {
nome = typeof it === "string" ? it : String(it.name);
} catch (e4) {nome = "";
}
if (nome) { 
out.push(nome);
}}
return out;
}
function _fsFxEfeitoVale(eff, nomePedido) {
if (!eff) { 
return false;
}
var n = "";
try {
n = String(eff.name);
} catch (e) {n = "";
}
if (!n) { 
return false;
}
return _fsFxNormNome(n) === _fsFxNormNome(nomePedido);
}
function _fsFxNomeDoMatch(matchName) {
var s = String((matchName) || (""));
if (!s) { 
return "";
}
s = s.replace(/^AE\.ADBE\s+/i, "");
s = s.replace(/^PR\.ADBE\s+/i, "");
s = s.replace(/^ADBE\s+/i, "");
s = s.replace(/^AE\.|^PR\./i, "");
return s === String(matchName) ? "" : s;
}
function _fsFxMatchDe(eff) {
var m = "";
try {
m = String(eff.matchName);
} catch (e) {m = "";
}
return m;
}
function _fsFxAcharEfeito(displayName, matchName) {
var tentativas = [displayName, matchName, _fsFxNomeDoMatch(matchName)];
for (var t = 0; t < tentativas.length; t += 1) { 
var nm = tentativas[t];
if (!nm) { 
continue ;
}
var e1 = null;
try {
e1 = qe.project.getVideoEffectByName(nm);
} catch (eV) {e1 = null;
}
if (_fsFxEfeitoVale(e1, nm)) { 
return {audio: false, efeito: e1, nome: nm};
}
var e2 = null;
try {
e2 = qe.project.getAudioEffectByName(nm);
} catch (eA2) {e2 = null;
}
if (_fsFxEfeitoVale(e2, nm)) { 
return {audio: true, efeito: e2, nome: nm};
}}
if (matchName) { 
var tiposM = ["v", "a"];
for (var km = 0; km < tiposM.length; km += 1) { 
var listaM = _fsFxListaEfeitos(tiposM[km]);
for (var im = 0; im < listaM.length; im += 1) { 
var efM = null;
try {
efM = tiposM[km] === "a" ? qe.project.getAudioEffectByName(listaM[im]) : qe.project.getVideoEffectByName(listaM[im]);
} catch (eM2) {efM = null;
}
if (!efM) { 
continue ;
}
if (_fsFxMatchDe(efM) === String(matchName)) { 
return {audio: tiposM[km] === "a", efeito: efM, nome: listaM[im]};
}}}
}
var alvos = [_fsFxNormNome(displayName), _fsFxNormNome(matchName)];
var tipos = ["v", "a"];
for (var k = 0; k < tipos.length; k += 1) { 
var lista = _fsFxListaEfeitos(tipos[k]);
for (var i = 0; i < lista.length; i += 1) { 
var norm = _fsFxNormNome(lista[i]);
if (!norm) { 
continue ;
}
var bate = false;
for (var j = 0; j < alvos.length; j += 1) { 
if (!alvos[j]) { 
continue ;
}
if ((norm === alvos[j]) || (((norm.length > 3) && (alvos[j].length > 3)) && ((norm.indexOf(alvos[j]) === 0) || (alvos[j].indexOf(norm) === 0)))) { 
bate = true;
break ;
}}
if (!bate) { 
continue ;
}
var ef = null;
try {
ef = tipos[k] === "a" ? qe.project.getAudioEffectByName(lista[i]) : qe.project.getVideoEffectByName(lista[i]);
} catch (eF) {ef = null;
}
if (_fsFxEfeitoVale(ef, lista[i])) { 
return {audio: tipos[k] === "a", efeito: ef, nome: lista[i]};
}}}
return null;
}
function _fsFxQeItem(kind, trackIdx, startTicks, half) {
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (e) {return null;
}
if (!qs) { 
return null;
}
var qtr = null;
try {
qtr = kind === "v" ? qs.getVideoTrackAt(trackIdx) : qs.getAudioTrackAt(trackIdx);
} catch (e2) {return null;
}
if (!qtr) { 
return null;
}
var n = 0;
try {
n = qtr.numItems;
} catch (e3) {return null;
}
for (var i = 0; i < n; i += 1) { 
var it = null;
try {
it = qtr.getItemAt(i);
} catch (e4) {continue ;
}
if (!it) { 
continue ;
}
var ty = "";
try {
ty = String(it.type);
} catch (e5) {
}
if (ty === "Empty") { 
continue ;
}
var st = NaN;
try {
st = parseFloat(it.start.ticks);
} catch (e6) {continue ;
}
if (Math.abs(st - startTicks) <= half) { 
return it;
}}
return null;
}
function _fsFxReadParams(comp) {
var out = [];
try {
_fsScWalk(comp.properties, [], out);
} catch (e) {return [];
}
var items = [];
for (var i = 0; i < out.length; i += 1) { 
var lf = out[i];
var it = {groups: lf.groups, name: lf.name};
if (lf.isColor) { 
it.isColor = true;
it.color = lf.color;
}
else {
it.value = lf.value;
it.text = !(!lf.text);
}
try {
if (((lf.prop) && (typeof lf.prop.isTimeVarying === "function")) && (lf.prop.isTimeVarying())) { 
var keys = lf.prop.getKeys();
if ((keys) && (keys.length)) { 
var ks = [];
for (var k = 0; k < keys.length; k += 1) { 
var ts = NaN;
try {
ts = parseFloat(keys[k].seconds);
} catch (eT) {continue ;
}
if (isNaN(ts)) { 
continue ;
}
var kv = null;
try {
kv = lf.prop.getValueAtKey(keys[k]);
} catch (eV) {kv = null;
}
ks.push({t: ts, v: kv});}
if (ks.length) { 
it.keys = ks;
}
}
}
} catch (eK) {
}
items.push(it);}
return items;
}
function _fsFxWriteParams(comp, items, stats) {
var leaves = [];
try {
_fsScWalk(comp.properties, [], leaves);
} catch (e) {return;
}
var byName = {};
for (var i = 0; i < leaves.length; i += 1) { 
var nm = (leaves[i].name) || ("");
if (!byName[nm]) { 
byName[nm] = [];
}
byName[nm].push(leaves[i]);}
for (var s = 0; s < items.length; s += 1) { 
var it = items[s];
var list = byName[(it.name) || ("")];
if ((!list) || (!list.length)) { 
stats.miss++;
continue ;
}
var tgt = list[0];
if (!tgt.prop) { 
stats.miss++;
continue ;
}
var okv = false;
if (it.isColor) { 
okv = _fsScWriteColor(tgt.prop, it.color);
}
else {
okv = _fsScApply(tgt.prop, it.value, it.text, true);
}
if (okv) { 
stats.ok++;
}
else {
stats.fail++;
}
if ((it.keys) && (it.keys.length)) { 
try {
if (typeof tgt.prop.setTimeVarying === "function") { 
tgt.prop.setTimeVarying(true);
}
for (var k = 0; k < it.keys.length; k += 1) { 
var kt = it.keys[k].t;
try {
tgt.prop.addKey(kt);
} catch (eA) {
}
try {
tgt.prop.setValueAtKey(kt, it.keys[k].v, true);
stats.keys++;
} catch (eS) {
}}
} catch (eKF) {
}
}}
}
function _fsFxTargets(seq, scope) {
var res = [];
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var locked = false;
try {
locked = tr.isLocked();
} catch (eL) {
}
if (locked) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
if (scope === "selected") { 
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
}
if (scope === "captions") { 
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (!mgt) { 
continue ;
}
}
var st = NaN;
try {
st = parseFloat(cl.start.ticks);
} catch (eSt) {continue ;
}
res.push({clip: cl, start: st, track: t});}}
return res;
}
function fsFxCopy() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var src = null;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (sel) { 
src = cl;
break ;
}}
if (src) { 
break ;
}}
if (!src) { 
return _fsJSON.stringify({error: "Selecione na timeline a legenda que j\xe1 est\xe1 com os efeitos que voc\xea quer guardar."});
}
var mgtName = "";
try {
var mg = src.getMGTComponent();
if (mg) { 
mgtName = String(mg.matchName);
}
} catch (eMg) {
}
var comps = null;
try {
comps = src.components;
} catch (eCp) {
}
if (!comps) { 
return _fsJSON.stringify({error: "N\xe3o consegui ler os efeitos desse clipe."});
}
var fx = [];
var nIntr = 0;
var nKeys = 0;
for (var i = 0; i < comps.numItems; i += 1) { 
var comp = null;
try {
comp = comps[i];
} catch (eI) {continue ;
}
if (!comp) { 
continue ;
}
var mn = "";
var dn = "";
try {
mn = String(comp.matchName);
} catch (eM2) {
}
try {
dn = String(comp.displayName);
} catch (eD) {
}
if ((mgtName) && (mn === mgtName)) { 
continue ;
}
var intr = _fsFxIsIntrinsic(mn);
if (intr) { 
nIntr++;
}
var params = _fsFxReadParams(comp);
for (var pk = 0; pk < params.length; pk += 1) { 
if (params[pk].keys) { 
nKeys++;
}}
fx.push({displayName: dn, intrinsic: intr, matchName: mn, params: params});}
if (!fx.length) { 
return _fsJSON.stringify({error: "Esse clipe n\xe3o tem efeitos pra copiar."});
}
var cname = "";
try {
cname = src.name;
} catch (eN) {
}
return _fsJSON.stringify({animated: nKeys, count: fx.length, from: cname, fx: fx, intrinsic: nIntr, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsFxPaste(fxJson, scope, skipIntrinsic) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var data = null;
try {
data = _fsJSON.parse(fxJson);
} catch (eP) {
}
if (((!data) || (!data.fx)) || (!data.fx.length)) { 
return _fsJSON.stringify({error: "Nenhum efeito guardado. Copie de uma legenda primeiro."});
}
var noIntr = ((skipIntrinsic === 1) || (skipIntrinsic === true)) || (skipIntrinsic === "1");
var targets = _fsFxTargets(seq, scope);
if (!targets.length) { 
return _fsJSON.stringify({error: scope === "selected" ? "Nenhum clipe selecionado na timeline." : "Nenhum clipe encontrado nas trilhas destravadas."});
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeOk = false;
try {
qeOk = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeOk = false;
}
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = 8467200000;
}
var half = tpf / 2;
var stats = {fail: 0, keys: 0, miss: 0, ok: 0};
var clipsOk = 0;
var added = 0;
var addFail = 0;
for (var ti = 0; ti < targets.length; ti += 1) { 
var tgt = targets[ti];
var comps = null;
try {
comps = tgt.clip.components;
} catch (eC) {continue ;
}
if (!comps) { 
continue ;
}
var have = {};
for (var h = 0; h < comps.numItems; h += 1) { 
try {
have[String(comps[h].matchName)] = comps[h];
} catch (eH) {
}}
var touched = false;
for (var f = 0; f < data.fx.length; f += 1) { 
var srcFx = data.fx[f];
if ((noIntr) && (srcFx.intrinsic)) { 
continue ;
}
var dstComp = (have[srcFx.matchName]) || (null);
if ((!dstComp) && (!srcFx.intrinsic)) { 
if (!qeOk) { 
addFail++;
continue ;
}
var qeIt = _fsFxQeItem("v", tgt.track, tgt.start, half);
if (!qeIt) { 
addFail++;
continue ;
}
var eff = null;
try {
eff = qe.project.getVideoEffectByName(srcFx.displayName);
} catch (eE) {eff = null;
}
if (!eff) { 
try {
eff = qe.project.getVideoEffectByName(srcFx.matchName);
} catch (eE2) {eff = null;
}
}
if (!eff) { 
addFail++;
continue ;
}
var okAdd = false;
try {
qeIt.addVideoEffect(eff);
okAdd = true;
} catch (eAdd) {
}
if (!okAdd) { 
addFail++;
continue ;
}
added++;
try {
comps = tgt.clip.components;
} catch (eRe) {
}
for (var r = 0; r < comps.numItems; r += 1) { 
try {
if (String(comps[r].matchName) === srcFx.matchName) { 
dstComp = comps[r];
break ;
}
} catch (eRr) {
}}
}
if (!dstComp) { 
continue ;
}
_fsFxWriteParams(dstComp, srcFx.params, stats);
touched = true;}
if (touched) { 
clipsOk++;
}}
var res = {addFail: addFail, added: added, clips: targets.length, clipsOk: clipsOk, keys: stats.keys, ok: true, params: stats.ok, paramsFail: stats.fail, paramsMiss: stats.miss};
if (addFail > 0) { 
res.warning = addFail + " efeito(s) n\xe3o puderam ser adicionados \u2014 o Premiere s\xf3 deixa adicionar efeito por nome, e alguns nomes n\xe3o s\xe3o encontrados por script.";
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsDynTargets(seq, scope) {
var res = [];
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var locked = false;
try {
locked = tr.isLocked();
} catch (eL) {
}
if (locked) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
if (scope === "selected") { 
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
}
var ehLegenda = false;
try {
ehLegenda = !(!cl.getMGTComponent());
} catch (eMg) {ehLegenda = false;
}
if (ehLegenda) { 
continue ;
}
var ehAjuste = false;
try {
ehAjuste = (_fsCaEhAjuste(cl.projectItem)) || (_fsCaEhAjuste(cl));
} catch (eAj) {ehAjuste = false;
}
if (ehAjuste) { 
continue ;
}
var st = NaN;
var en = NaN;
try {
st = parseFloat(cl.start.ticks);
en = parseFloat(cl.end.ticks);
} catch (eP) {continue ;
}
if ((isNaN(st)) || (isNaN(en))) { 
continue ;
}
res.push({clip: cl, end: en, idx: c, start: st, track: t});}}
return res;
}
function _fsDynQeItem(trackIdx, startTicks, half) {
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (e) {return null;
}
if (!qs) { 
return null;
}
var qtr = null;
try {
qtr = qs.getVideoTrackAt(trackIdx);
} catch (e2) {return null;
}
if (!qtr) { 
return null;
}
var n = 0;
try {
n = qtr.numItems;
} catch (e3) {return null;
}
for (var i = 0; i < n; i += 1) { 
var it = null;
try {
it = qtr.getItemAt(i);
} catch (e4) {continue ;
}
if (!it) { 
continue ;
}
var ty = "";
try {
ty = String(it.type);
} catch (e5) {
}
if (ty === "Empty") { 
continue ;
}
var st = NaN;
try {
st = parseFloat(it.start.ticks);
} catch (e6) {continue ;
}
if (Math.abs(st - startTicks) <= half) { 
return it;
}}
return null;
}
function _fsDynCountTransitions(seq, trackIdx) {
var n = 0;
try {
var tr = seq.videoTracks[trackIdx];
if ((tr) && (tr.transitions)) { 
n = tr.transitions.numItems;
}
} catch (e) {
}
return n;
}
function _fsPrVersao() {
var v = "";
try {
v = String(app.version);
} catch (e) {
}
return (v) || ("?");
}
function _fsIdioma() {
if (_FS_IDIOMA) { 
return _FS_IDIOMA;
}
var loc = "";
try {
loc = String($.locale);
} catch (e) {
}
_FS_IDIOMA = loc.toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
return _FS_IDIOMA;
}
function fsDefinirIdioma(loc) {
try {
var l = String((loc) || ("")).toLowerCase();
_FS_IDIOMA = l.indexOf("pt") === 0 ? "pt" : "en";
} catch (e) {
}
return _fsJSON.stringify({engine: String($.locale), idioma: _FS_IDIOMA, locale: String((loc) || ("")), ok: true});
}
function _fsNomes(en, pt) {
var a = en instanceof Array ? en : [en];
var b = pt instanceof Array ? pt : [pt];
var out = _fsIdioma() === "pt" ? b.concat(a) : a.concat(b);
var vistos = {};
var lim = [];
for (var i = 0; i < out.length; i += 1) { 
var n = out[i];
if (((n === null) || (n === undefined)) || (n === "")) { 
continue ;
}
if (vistos[n]) { 
continue ;
}
vistos[n] = 1;
lim.push(n);}
return lim;
}
function _fsNomesDe(chave) {
switch (chave) { 
case "efeitoTransform":
return _fsNomes(["Transform", "AE.ADBE Geometry2", "AE.ADBE Geometry"], "Transformar");
case "camadaAjuste":
return _fsNomes("Adjustment Layer", ["Camada de ajuste", "Camada de Ajuste"]);
case "propEscala":
return _fsNomes(["scale height", "scale", "ADBE Scale"], ["dimensionar altura", "escala da altura", "altura da escala", "escala"]);
case "propEscalaLarg":
return _fsNomes(["scale width", "ADBE Scale Width"], ["dimensionar largura", "escala da largura", "largura da escala"]);
case "propEscalaUnif":
return _fsNomes("uniform scale", ["dimensionar uniformemente", "escala uniforme", "dimensionamento uniforme"]);
case "propPosicao":
return _fsNomes(["position", "ADBE Position"], "posicao");
case "propAncora":
return _fsNomes(["anchor point", "ADBE Anchor Point"], ["ponto de ancoragem", "ponto de ancora"]);
case "propObturador":
return _fsNomes("shutter angle", ["angulo do obturador", "obturador"]);
case "propOpacidade":
return _fsNomes(["opacity", "ADBE Opacity"], "opacidade");
case "propNivel":
return _fsNomes("level", ["nivel", "volume"]);
case "compMovimento":
return _fsNomes(["Motion", "AE.ADBE Motion", "ADBE Motion"], "Movimento");
}
return [];
}
function _fsNomesTransicao(nome) {
var DISSOL = "Dissolu\xe7\xe3o";
var DISSOLV = "Dissolv\xeancia";
var PELIC = "pel\xedcula";
switch (nome) { 
case "Film Dissolve":
return _fsNomes(nome, [DISSOL + " de " + PELIC, DISSOL + " de filme", DISSOLV + " de " + PELIC, "dissolucao de pelicula", "dissolucao de filme", "dissolvencia de pelicula"]);
case "Cross Dissolve":
return _fsNomes(nome, [DISSOL + " cruzada", DISSOLV + " cruzada", "dissolucao cruzada", "dissolvencia cruzada"]);
case "Dip to Black":
return _fsNomes(nome, ["Para preto (herdado)", "Para preto", "Mergulhar em preto", "Mergulhar no preto", "Escurecer para preto", "Esmaecer para preto", "mergulhar em preto", "mergulhar no preto", "escurecer para preto", "esmaecer para preto"]);
case "Dip to White":
return _fsNomes(nome, ["Para branco (herdado)", "Para branco", "Mergulhar em branco", "Mergulhar no branco", "Clarear para branco", "Escurecer para branco", "mergulhar em branco", "mergulhar no branco", "clarear para branco", "escurecer para branco"]);
case "Additive Dissolve":
return _fsNomes(nome, [DISSOL + " aditiva", DISSOLV + " aditiva", "dissolucao aditiva", "dissolvencia aditiva"]);
}
return _fsNomes(nome, null);
}
function _fsListaTransicoesQE() {
var qs = null;
try {
qs = qe.project;
} catch (e) {return [];
}
if (!qs) { 
return [];
}
var bruto = null;
try {
bruto = qs.getVideoTransitionList();
} catch (e2) {bruto = null;
}
if (!bruto) { 
return [];
}
var out = [];
var n = 0;
try {
n = bruto.length;
} catch (e3) {n = 0;
}
for (var i = 0; i < n; i += 1) { 
var it = bruto[i];
var nomeT = "";
try {
nomeT = typeof it === "string" ? it : String(it.name);
} catch (e4) {nomeT = "";
}
if ((nomeT) && (nomeT !== "undefined")) { 
out.push(nomeT);
}}
return out;
}
function fsApplyTransitions(optsJson) {
try {
function _sortear() {
var vivos = [];
for (var s = 0; s < grupos.length; s += 1) { 
if (!grupos[s].ruim) { 
vivos.push(s);
}}
if (!vivos.length) { 
return -1;
}
if (vivos.length === 1) { 
return vivos[0];
}
if (!sacola.length) { 
sacola = vivos.slice();
for (var f = sacola.length - 1; f > 0; f--) { 
var t = Math.floor(Math.random() * (f + 1));
var tmp = sacola[f];
sacola[f] = sacola[t];
sacola[t] = tmp;}
if ((sacola.length > 1) && (sacola[0] === ultimoIx)) { 
var tr0 = sacola[0];
sacola[0] = sacola[1];
sacola[1] = tr0;
}
}
return sacola.shift();
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var nome = (o.name) || ("Cross Dissolve");
var frames = parseInt(o.frames, 10);
if ((isNaN(frames)) || (frames < 1)) { 
frames = 10;
}
var align = typeof o.alignment === "number" ? o.alignment : 0.5;
var betweenOnly = o.betweenOnly !== false;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeOk = false;
try {
qeOk = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeOk = false;
}
if (!qeOk) { 
return _fsJSON.stringify({error: "N\xe3o consegui acessar o motor do Premiere (QE). Reinicie o Premiere e tente de novo \u2014 nada foi alterado."});
}
var pedidas = [];
if ((o.names) && (o.names.length)) { 
for (var _pi = 0; _pi < o.names.length; _pi += 1) { 
if (o.names[_pi]) { 
pedidas.push(String(o.names[_pi]));
}}
}
if (!pedidas.length) { 
pedidas.push(nome);
}
var listaRealT = _fsListaTransicoesQE();
var grupos = [];
var semNenhuma = [];
for (var _gi = 0; _gi < pedidas.length; _gi += 1) { 
var nomesCand = _fsNomesTransicao(pedidas[_gi]);
var cands = [];
var _vistosCand = {};
for (var _ci = 0; _ci < nomesCand.length; _ci += 1) { 
var _tObj = null;
try {
_tObj = qe.project.getVideoTransitionByName(nomesCand[_ci]);
} catch (eT) {_tObj = null;
}
if (_tObj) { 
cands.push({nome: nomesCand[_ci], obj: _tObj});
_vistosCand[_fsFxNormNome(nomesCand[_ci])] = 1;
}}
for (var _li = 0; _li < listaRealT.length; _li += 1) { 
var _nReal = listaRealT[_li];
var _nrm = _fsFxNormNome(_nReal);
if ((!_nrm) || (_vistosCand[_nrm])) { 
continue ;
}
var _casa = false;
for (var _cj = 0; (_cj < nomesCand.length) && (!_casa); _cj++) { 
var _alvoN = _fsFxNormNome(nomesCand[_cj]);
if (_alvoN.length < 4) { 
continue ;
}
if (((_nrm === _alvoN) || ((_nrm.length >= 4) && (_alvoN.indexOf(_nrm) !== -1))) || (_nrm.indexOf(_alvoN) !== -1)) { 
_casa = true;
}}
if (!_casa) { 
continue ;
}
var _tReal = null;
try {
_tReal = qe.project.getVideoTransitionByName(_nReal);
} catch (eTR) {_tReal = null;
}
if (_tReal) { 
cands.push({nome: _nReal, obj: _tReal});
_vistosCand[_nrm] = 1;
}}
if (cands.length) { 
grupos.push({candidatas: cands, pedida: pedidas[_gi], ruim: false, usos: 0, validada: null});
}
else {
semNenhuma.push(pedidas[_gi]);
}}
if (!grupos.length) { 
return _fsJSON.stringify({error: "A transi\xe7\xe3o \"" + pedidas.join("\", \"") + "\" n\xe3o foi encontrada no seu Premiere (" + _fsPrVersao() + "). Confira o nome exato na aba Efeitos e me mande um print."});
}
var sacola = [];
var ultimoIx = -1;
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = 8467200000;
}
var half = tpf / 2;
var autoT = o.scope === "auto";
var targets = _fsDynTargets(seq, autoT ? "all" : (o.scope) || ("all"));
if (!targets.length) { 
return _fsJSON.stringify({error: "Nenhum clipe de v\xeddeo encontrado nas trilhas destravadas."});
}
var elegiveis = [];
for (var i = 0; i < targets.length; i += 1) { 
var cur = targets[i];
if (!betweenOnly) { 
elegiveis.push(cur);
continue ;
}
var temVizinho = false;
for (var j = 0; j < targets.length; j += 1) { 
if (j === i) { 
continue ;
}
var o2 = targets[j];
if (o2.track !== cur.track) { 
continue ;
}
if (Math.abs(o2.end - cur.start) <= half) { 
temVizinho = true;
break ;
}}
if (temVizinho) { 
elegiveis.push(cur);
}}
if (!elegiveis.length) { 
return _fsJSON.stringify({error: "Nenhum corte encontrado (os clipes precisam estar encostados uns nos outros)."});
}
var TPS_T = 254016000000;
var achadosT = elegiveis.length;
if (autoT) { 
elegiveis = _fsDynAutoCortes(elegiveis, TPS_T, _fsDynEspaco(o.intensidade));
if (!elegiveis.length) { 
return _fsJSON.stringify({error: "Nenhum corte escolhido pelo autom\xe1tico. Baixe o espa\xe7amento ou use \'todos\'."});
}
}
var durStr = String(frames);
var aplicadas = 0;
var falhas = 0;
var modoOk = "";
var semItemQe = 0;
var aceitasSemEntrar = 0;
var ultimaExc = "";
var transValidada = null;
for (var k = 0; k < elegiveis.length; k += 1) { 
var alvo = elegiveis[k];
var qeIt = _fsDynQeItem(alvo.track, alvo.start, half);
if (!qeIt) { 
falhas++;
semItemQe++;
continue ;
}
var _tentar = function (tr) {
var f = false;
if (!f) { 
try {
qeIt.addTransition(tr, true, durStr, "0", align, false, false);
f = true;
} catch (e1) {ultimaExc = String(e1);
}
}
if (!f) { 
try {
qeIt.addTransition(tr, true, durStr, "0", align);
f = true;
} catch (e2) {ultimaExc = String(e2);
}
}
if (!f) { 
try {
qeIt.addTransition(tr, true, durStr);
f = true;
} catch (e3) {ultimaExc = String(e3);
}
}
if (!f) { 
try {
qeIt.addTransition(tr, true);
f = true;
} catch (e4) {ultimaExc = String(e4);
}
}
if (!f) { 
try {
qeIt.addTransition(tr);
f = true;
} catch (e5) {ultimaExc = String(e5);
}
}
return f;
};
var aceitou = null;
var grupoIx = -1;
var ordem = [];
var primeiro = _sortear();
if (primeiro >= 0) { 
ordem.push(primeiro);
}
for (var go = 0; go < grupos.length; go += 1) { 
if ((go !== primeiro) && (!grupos[go].ruim)) { 
ordem.push(go);
}}
for (var oi = 0; (oi < ordem.length) && (!aceitou); oi++) { 
var G = grupos[ordem[oi]];
var tentativas = G.validada ? [G.validada] : G.candidatas;
for (var tI = 0; tI < tentativas.length; tI += 1) { 
var antes = _fsDynCountTransitions(seq, alvo.track);
if (!_tentar(tentativas[tI].obj)) { 
continue ;
}
var depois = _fsDynCountTransitions(seq, alvo.track);
if (depois > antes) { 
aceitou = tentativas[tI];
grupoIx = ordem[oi];
G.validada = tentativas[tI];
break ;
}
aceitasSemEntrar++;}
if (((!aceitou) && (!G.validada)) && (oi === 0)) { 
G.ruim = true;
}}
if (aceitou) { 
aplicadas++;
grupos[grupoIx].usos++;
ultimoIx = grupoIx;
transValidada = aceitou;
if (!modoOk) { 
modoOk = "ok";
}
}
else {
falhas++;
}}
var usadas = [];
for (var ui = 0; ui < grupos.length; ui += 1) { 
if (grupos[ui].usos) { 
usadas.push(grupos[ui].pedida + " x" + grupos[ui].usos);
}}
var res = {achados: achadosT, aplicadas: aplicadas, auto: autoT ? 1 : 0, cortes: elegiveis.length, falhas: falhas, frames: frames, naoInstaladas: semNenhuma.join(", "), ok: true, rodizio: usadas.join(", "), transicao: transValidada ? transValidada.nome : nome};
if (aplicadas === 0) { 
var recusadas = (falhas - semItemQe) - aceitasSemEntrar;
if (recusadas < 0) { 
recusadas = 0;
}
var _pistasT = [];
if (listaRealT.length) { 
var _tokensT = {};
for (var _tk = 0; _tk < pedidas.length; _tk += 1) { 
var _nmk = _fsNomesTransicao(pedidas[_tk]);
for (var _tk2 = 0; _tk2 < _nmk.length; _tk2 += 1) { 
var _pals = _fsFxNormNome(_nmk[_tk2]);
var _crus = _fsSemAcento(String(_nmk[_tk2]).toLowerCase()).split(/[^a-z]+/);
for (var _tk3 = 0; _tk3 < _crus.length; _tk3 += 1) { 
if (_crus[_tk3].length >= 4) { 
_tokensT[_fsFxNormNome(_crus[_tk3])] = 1;
}}}}
for (var _pl = 0; (_pl < listaRealT.length) && (_pistasT.length < 6); _pl++) { 
var _nrl = _fsFxNormNome(listaRealT[_pl]);
for (var _tok in _tokensT) { 
if ((_tokensT.hasOwnProperty(_tok)) && (_nrl.indexOf(_tok) !== -1)) { 
_pistasT.push(listaRealT[_pl]);
break ;
}
}}
}
res.warning = "Nenhuma transi\xe7\xe3o entrou (Premiere " + _fsPrVersao() + "). Raio-x: " + semItemQe + " sem clipe no motor QE, " + aceitasSemEntrar + " aceitas mas n\xe3o inseridas, " + recusadas + " recusadas" + ultimaExc ? " \u2014 \xfaltima recusa: " + ultimaExc : "" + listaRealT.length ? " | a lista do QE tem " + listaRealT.length + " transi\xe7\xf5es" + _pistasT.length ? "; as mais parecidas: " + _pistasT.join(", ") : "; nenhuma parecida com os nomes tentados" : " | getVideoTransitionList() vazio ou indispon\xedvel" + ". Me manda um print desta mensagem que eu adapto pra sua vers\xe3o.";
}
else {
if (falhas > 0) { 
res.warning = falhas + " corte(s) n\xe3o receberam transi\xe7\xe3o (provavelmente falta espa\xe7o de sobra no clipe pra abrir a transi\xe7\xe3o).";
}
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsDynScaleProp(clip) {
var comps = null;
try {
comps = clip.components;
} catch (e) {return null;
}
if (!comps) { 
return null;
}
for (var i = 0; i < comps.numItems; i += 1) { 
var c = null;
try {
c = comps[i];
} catch (eC) {continue ;
}
if (!c) { 
continue ;
}
var mn = "";
try {
mn = String(c.matchName).toLowerCase();
} catch (eM) {
}
var dn = "";
try {
dn = String(c.displayName).toLowerCase();
} catch (eD) {
}
if (((mn.indexOf("motion") === -1) && (dn.indexOf("motion") === -1)) && (dn.indexOf("movimento") === -1)) { 
continue ;
}
var props = null;
try {
props = c.properties;
} catch (eP) {continue ;
}
if (!props) { 
continue ;
}
for (var p = 0; p < props.numItems; p += 1) { 
var pr = null;
try {
pr = props[p];
} catch (ePr) {continue ;
}
if (!pr) { 
continue ;
}
var pn = "";
try {
pn = String(pr.displayName).toLowerCase();
} catch (ePn) {
}
if (((pn === "scale") || (pn === "escala")) || (pn === "zoom")) { 
return pr;
}}}
return null;
}
function _fsDynGravou(prop, t, v) {
var lido = NaN;
try {
lido = parseFloat(prop.getValueAtKey(t));
} catch (e) {return false;
}
if (isNaN(lido)) { 
return false;
}
return Math.abs(lido - v) < 0.51;
}
function _fsDynTempos(alvo, TPS) {
var lista = [];
var i0 = NaN;
var i1 = NaN;
try {
i0 = parseFloat(alvo.clip.inPoint.seconds);
} catch (eA) {
}
try {
i1 = parseFloat(alvo.clip.outPoint.seconds);
} catch (eB) {
}
if (((!isNaN(i0)) && (!isNaN(i1))) && (i1 > i0)) { 
lista.push([i0, i1, "fonte"]);
}
var dur = (alvo.end - alvo.start) / TPS;
lista.push([0, dur, "rel"]);
lista.push([alvo.start / TPS, alvo.end / TPS, "abs"]);
return lista;
}
function _fsDynEspacoZoom(intens) {
if (intens === "pouca") { 
return 15;
}
if (intens === "muita") { 
return 4;
}
return 8;
}
function _fsDynAutoZoom(targets, TPS, intens) {
var espaco = _fsDynEspacoZoom(intens);
var MIN = 0.8;
var MAX = 15;
var DUR_MOMENTO = 4;
var ord = [];
for (var a = 0; a < targets.length; a += 1) { 
ord.push(targets[a]);}
ord.sort(function (x, y) {
return x.start - y.start;
});
var bons = [];
for (var i = 0; i < ord.length; i += 1) { 
var d = (ord[i].end - ord[i].start) / TPS;
if (d < MIN) { 
continue ;
}
if (d <= MAX) { 
bons.push({dur: d, ini: ord[i].start / TPS, t: ord[i]});
continue ;
}
var iniSeg = ord[i].start / TPS;
var fimSeg = ord[i].end / TPS;
for (var mSeg = iniSeg; (mSeg + DUR_MOMENTO) <= fimSeg; mSeg += espaco) { 
var alvoM = {};
for (var kM in ord[i]) { 
if (ord[i].hasOwnProperty(kM)) { 
alvoM[kM] = ord[i][kM];
}
}
alvoM.start = Math.round(mSeg * TPS);
alvoM.end = Math.round((mSeg + DUR_MOMENTO) * TPS);
bons.push({dur: DUR_MOMENTO, ini: mSeg, mom: true, t: alvoM});}}
if (!bons.length) { 
return [];
}
var spanSeg = (ord[ord.length - 1].end - ord[0].start) / TPS;
var teto = Math.ceil(bons.length * 0.4);
var porTempo = Math.ceil(spanSeg / espaco);
if (porTempo > teto) { 
teto = porTempo;
}
if (teto > bons.length) { 
teto = bons.length;
}
if (teto < 1) { 
teto = 1;
}
var esc = [bons[0].t];
var ultimoTempo = bons[0].ini;
var ultimoIdx = 0;
var RESPIRO_ZOOM = 1.5;
var ultimoFim = bons[0].t.end / TPS;
var i2 = 1;
while ((i2 < bons.length) && (esc.length < teto)) {
if ((bons[i2].ini - ultimoTempo) < espaco) { 
i2++;
continue ;
}
if (bons[i2].ini < (ultimoFim + RESPIRO_ZOOM)) { 
i2++;
continue ;
}
var melhor = i2;
var j = i2;
while ((j < bons.length) && ((bons[j].ini - bons[i2].ini) < espaco)) {
if (bons[j].dur > bons[melhor].dur) { 
melhor = j;
}
j++;
}
if (((!bons[melhor].mom) && (!bons[ultimoIdx].mom)) && ((melhor - ultimoIdx) < 2)) { 
if ((i2 - ultimoIdx) >= 2) { 
melhor = i2;
}
else {
i2 = ultimoIdx + 2;
continue ;
}
}
if (bons[melhor].ini < (ultimoFim + RESPIRO_ZOOM)) { 
i2 = melhor + 1;
continue ;
}
esc.push(bons[melhor].t);
ultimoTempo = bons[melhor].ini;
ultimoFim = bons[melhor].t.end / TPS;
ultimoIdx = melhor;
i2 = melhor + 1;
}
return esc;
}
function _fsDynAutoCortes(elegiveis, TPS, espacoSeg) {
var ord = [];
for (var a = 0; a < elegiveis.length; a += 1) { 
ord.push(elegiveis[a]);}
ord.sort(function (x, y) {
return x.start - y.start;
});
var esc = [];
var ultimo = -999999;
for (var i = 0; i < ord.length; i += 1) { 
var t = ord[i].start / TPS;
if ((t - ultimo) < espacoSeg) { 
continue ;
}
esc.push(ord[i]);
ultimo = t;}
return esc;
}
function _fsDynEspaco(intens) {
if (intens === "pouca") { 
return 12;
}
if (intens === "muita") { 
return 2.5;
}
return 6;
}
function fsApplyZoom(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var from = parseFloat(o.from);
if (isNaN(from)) { 
from = 100;
}
var to = parseFloat(o.to);
if (isNaN(to)) { 
to = 112;
}
var modo = (o.mode) || ("in");
var TPS = 254016000000;
var auto = o.scope === "auto";
var targets = _fsDynTargets(seq, auto ? "all" : (o.scope) || ("selected"));
if (!targets.length) { 
return _fsJSON.stringify({error: o.scope === "selected" ? "Nenhum clipe selecionado na timeline." : "Nenhum clipe de v\xeddeo encontrado nas trilhas destravadas."});
}
var achados = targets.length;
var forade = 0;
if (auto) { 
var escolhidos = _fsDynAutoZoom(targets, TPS, o.intensidade);
forade = achados - escolhidos.length;
targets = escolhidos;
if (!targets.length) { 
return _fsJSON.stringify({error: "Nenhum clipe com dura\xe7\xe3o boa pra zoom (entre 0,6s e 15s). Use \'todos\' pra for\xe7ar."});
}
}
var feitos = 0;
var semEscala = 0;
var falhas = 0;
var modoTempo = "";
for (var i = 0; i < targets.length; i += 1) { 
var alvo = targets[i];
var prop = _fsDynScaleProp(alvo.clip);
if (!prop) { 
semEscala++;
continue ;
}
var ini = from;
var fim = to;
if (modo === "out") { 
ini = to;
fim = from;
}
else {
if (modo === "alternate") { 
if ((i % 2) === 1) { 
ini = to;
fim = from;
}
}
}
if (((alvo.end - alvo.start) / TPS) <= 0.04) { 
falhas++;
continue ;
}
try {
if (typeof prop.setTimeVarying === "function") { 
prop.setTimeVarying(true);
}
} catch (eTV) {
}
var tentativas = _fsDynTempos(alvo, TPS);
if (modoTempo) { 
var fila = [];
for (var q = 0; q < tentativas.length; q += 1) { 
if (tentativas[q][2] === modoTempo) { 
fila.push(tentativas[q]);
}}
for (var q2 = 0; q2 < tentativas.length; q2 += 1) { 
if (tentativas[q2][2] !== modoTempo) { 
fila.push(tentativas[q2]);
}}
tentativas = fila;
}
var ok = false;
for (var a = 0; a < tentativas.length; a += 1) { 
var t0 = tentativas[a][0];
var t1 = tentativas[a][1];
var tag = tentativas[a][2];
if (!(t1 > t0)) { 
continue ;
}
try {
if (typeof prop.removeKeyRange === "function") { 
prop.removeKeyRange(t0, t1);
}
} catch (eR) {
}
try {
prop.addKey(t0);
} catch (eA1) {
}
try {
prop.addKey(t1);
} catch (eA2) {
}
try {
prop.setValueAtKey(t0, ini, true);
} catch (eS1) {
}
try {
prop.setValueAtKey(t1, fim, true);
} catch (eS2) {
}
if ((_fsDynGravou(prop, t0, ini)) && (_fsDynGravou(prop, t1, fim))) { 
modoTempo = tag;
ok = true;
break ;
}}
if (ok) { 
feitos++;
}
else {
falhas++;
}}
var res = {achados: achados, auto: auto ? 1 : 0, clipes: targets.length, falhas: falhas, feitos: feitos, forade: forade, modo: modo, ok: true, semEscala: semEscala, tempo: modoTempo};
if (feitos === 0) { 
res.warning = "Nenhum zoom foi aplicado. Se os clipes forem gr\xe1ficos/legendas, a Escala pode n\xe3o estar acess\xedvel por script.";
}
else {
if (semEscala > 0) { 
res.warning = semEscala + " clipe(s) sem propriedade de Escala acess\xedvel.";
}
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsClearZoom(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var targets = _fsDynTargets(seq, (o.scope) || ("selected"));
var limpos = 0;
for (var i = 0; i < targets.length; i += 1) { 
var prop = _fsDynScaleProp(targets[i].clip);
if (!prop) { 
continue ;
}
var tinha = false;
try {
tinha = (typeof prop.isTimeVarying === "function") && (prop.isTimeVarying());
} catch (eT) {
}
if (!tinha) { 
continue ;
}
try {
prop.setTimeVarying(false);
limpos++;
} catch (eS) {
}}
return _fsJSON.stringify({clipes: targets.length, limpos: limpos, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsPvParse(s) {
if ((s === null) || (s === undefined)) { 
return null;
}
if (typeof s === "number") { 
return s;
}
var t = String(s);
if (t.indexOf(":") !== -1) { 
var xy = t.split(":");
if (xy.length === 2) { 
var px = parseFloat(xy[0]);
var py = parseFloat(xy[1]);
if ((!isNaN(px)) && (!isNaN(py))) { 
return [px, py];
}
}
}
if (t.indexOf(",") !== -1) { 
var partes = t.split(",");
var arr = [];
var ok = true;
for (var i = 0; i < partes.length; i += 1) { 
var n = parseFloat(partes[i]);
if (isNaN(n)) { 
ok = false;
break ;
}
arr.push(n);}
if ((ok) && (arr.length)) { 
return arr;
}
}
var num = parseFloat(t);
if ((!isNaN(num)) && (/^[-0-9.eE+]+$/.test(t.replace(/\.$/, "")))) { 
return num;
}
return t;
}
function _fsPvWrite(prop, spec, clipStartSec, stats) {
var val = _fsPvParse(spec.value);
if ((!spec.keys) || (!spec.keys.length)) { 
var ok = false;
try {
prop.setValue(val, true);
ok = true;
} catch (e1) {
}
if (!ok) { 
try {
prop.setValue(val);
ok = true;
} catch (e2) {
}
}
if (ok) { 
stats.ok++;
}
else {
stats.fail++;
}
return;
}
try {
if (typeof prop.setTimeVarying === "function") { 
prop.setTimeVarying(true);
}
} catch (eTV) {
}
var criou = 0;
for (var k = 0; k < spec.keys.length; k += 1) { 
var kt = parseFloat(spec.keys[k].t);
if ((isNaN(kt)) || (kt < 0)) { 
continue ;
}
var kv = _fsPvParse(spec.keys[k].v);
var feito = false;
try {
prop.addKey(kt);
prop.setValueAtKey(kt, kv, true);
feito = true;
} catch (eR) {
}
if (!feito) { 
var abs = clipStartSec + kt;
try {
prop.addKey(abs);
prop.setValueAtKey(abs, kv, true);
feito = true;
} catch (eA) {
}
}
if (feito) { 
criou++;
}}
if (criou) { 
stats.ok++;
stats.keys += criou;
}
else {
stats.fail++;
}
}
function fsPresetApply(presetJson, scope, skipIntrinsic) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var pre = null;
try {
pre = _fsJSON.parse(presetJson);
} catch (eP) {
}
if (((!pre) || (!pre.comps)) || (!pre.comps.length)) { 
return _fsJSON.stringify({error: "Preset vazio ou n\xe3o reconhecido."});
}
var noIntr = ((skipIntrinsic === 1) || (skipIntrinsic === true)) || (skipIntrinsic === "1");
var soIntrinsecos = true;
for (var vi = 0; vi < pre.comps.length; vi += 1) { 
if (!pre.comps[vi].intrinsic) { 
soIntrinsecos = false;
break ;
}}
if (soIntrinsecos) { 
noIntr = false;
}
var pulados = 0;
var puladosNomes = [];
var targets = _fsFxTargets(seq, (scope) || ("selected"));
if (!targets.length) { 
return _fsJSON.stringify({error: scope === "selected" ? "Nenhum clipe selecionado na timeline." : "Nenhum clipe encontrado nas trilhas destravadas."});
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qeOk = false;
try {
qeOk = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {qeOk = false;
}
var TPS = 254016000000;
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = TPS / 30;
}
var half = tpf / 2;
var stats = {fail: 0, keys: 0, ok: 0};
var clipesOk = 0;
var adicionados = 0;
var naoAdicionados = 0;
var semParam = 0;
var porque = {};
for (var ti = 0; ti < targets.length; ti += 1) { 
var alvo = targets[ti];
var clipStartSec = alvo.start / TPS;
var comps = null;
try {
comps = alvo.clip.components;
} catch (eC) {continue ;
}
if (!comps) { 
continue ;
}
var tocou = false;
for (var ci = 0; ci < pre.comps.length; ci += 1) { 
function _fxColetar(ps) {
var nPs = 0;
try {
nPs = ps.numItems;
} catch (eNp) {return;
}
for (var pi = 0; pi < nPs; pi += 1) { 
var pp = null;
try {
pp = ps[pi];
} catch (ePn) {naOrdem.push(null);
continue ;
}
if (!pp) { 
naOrdem.push(null);
continue ;
}
var kids = 0;
try {
kids = (pp.numItems) || (0);
} catch (eKd) {kids = 0;
}
if (kids > 0) { 
_fxColetar(pp);
continue ;
}
naOrdem.push(pp);
try {
var pn = String(pp.displayName);
if (!porNome[pn]) { 
porNome[pn] = pp;
}
var pns = _fsSemAcento(pn);
if (!porSemAcento[pns]) { 
porSemAcento[pns] = pp;
}
} catch (ePn2) {
}}
}
var srcC = pre.comps[ci];
if ((noIntr) && (srcC.intrinsic)) { 
if (ti === 0) { 
pulados++;
puladosNomes.push(String(((srcC.displayName) || (srcC.matchName)) || ("?")));
}
continue ;
}
var dst = null;
for (var h = 0; h < comps.numItems; h += 1) { 
try {
if (String(comps[h].matchName) === srcC.matchName) { 
dst = comps[h];
break ;
}
} catch (eH) {
}}
if ((!dst) && (!srcC.intrinsic)) { 
if (!qeOk) { 
naoAdicionados++;
_fsFxPorque(porque, "semQE", srcC.displayName);
continue ;
}
var qeIt = _fsFxQeItem("v", alvo.track, alvo.start, half);
if (!qeIt) { 
naoAdicionados++;
_fsFxPorque(porque, "clipeNaoAchado", srcC.displayName);
continue ;
}
var achado = _fsFxAcharEfeito(srcC.displayName, srcC.matchName);
if (!achado) { 
naoAdicionados++;
var _pista = String((srcC.displayName) || ("?"));
var _emIngles = _fsFxNomeDoMatch(srcC.matchName);
if ((_emIngles) && (_fsFxNormNome(_emIngles) !== _fsFxNormNome(srcC.displayName))) { 
_pista += " (em ingl\xeas: " + _emIngles + ")";
}
_fsFxPorque(porque, "efeitoNaoInstalado", _pista);
continue ;
}
var eff = achado.efeito;
var okAdd = false;
if (!achado.audio) { 
try {
qeIt.addVideoEffect(eff);
okAdd = true;
} catch (eAdd) {
}
}
if (!okAdd) { 
try {
qeIt.addAudioEffect(eff);
okAdd = true;
} catch (eAdd2) {
}
}
if ((!okAdd) && (!achado.audio)) { 
try {
qeIt.addVideoEffect(eff);
okAdd = true;
} catch (eAdd3) {
}
}
if (!okAdd) { 
naoAdicionados++;
_fsFxPorque(porque, "addRecusado", srcC.displayName);
continue ;
}
try {
comps = alvo.clip.components;
} catch (eRe) {
}
for (var r = 0; r < comps.numItems; r += 1) { 
try {
if (String(comps[r].matchName) === srcC.matchName) { 
dst = comps[r];
break ;
}
} catch (eR2) {
}}
if (!dst) { 
naoAdicionados++;
_fsFxPorque(porque, "naoConfirmado", srcC.displayName + " (via " + achado.nome + ")");
continue ;
}
adicionados++;
}
if (!dst) { 
continue ;
}
var props = null;
try {
props = dst.properties;
} catch (ePr) {continue ;
}
if (!props) { 
continue ;
}
var porNome = {};
var porSemAcento = {};
var naOrdem = [];
_fxColetar(props);
var mesmaContagem = srcC.params.length === naOrdem.length;
for (var si = 0; si < srcC.params.length; si += 1) { 
var spec = srcC.params[si];
var prop = porNome[spec.name];
if (!prop) { 
prop = porSemAcento[_fsSemAcento(spec.name)];
}
if ((!prop) && (mesmaContagem)) { 
prop = naOrdem[si];
}
if (!prop) { 
semParam++;
continue ;
}
_fsPvWrite(prop, spec, clipStartSec, stats);
tocou = true;}}
if (tocou) { 
clipesOk++;
}}
var res = {adicionados: adicionados, clipes: targets.length, clipesOk: clipesOk, keys: stats.keys, naoAdicionados: naoAdicionados, ok: true, params: stats.ok, paramsFalha: stats.fail, porque: porque, preset: (pre.name) || (""), pulados: pulados, puladosNomes: puladosNomes, semParam: semParam, soIntrinsecos: soIntrinsecos};
if (naoAdicionados > 0) { 
res.warning = naoAdicionados + " efeito(s) n\xe3o puderam ser adicionados. O Premiere s\xf3 permite adicionar efeito por nome via uma via n\xe3o documentada, e alguns nomes n\xe3o s\xe3o encontrados.";
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsDynPreview(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = 8467200000;
}
var half = tpf / 2;
var targets = _fsDynTargets(seq, (o.scope) || ("all"));
var cortes = 0;
for (var i = 0; i < targets.length; i += 1) { 
for (var j = 0; j < targets.length; j += 1) { 
if (j === i) { 
continue ;
}
if (targets[j].track !== targets[i].track) { 
continue ;
}
if (Math.abs(targets[j].end - targets[i].start) <= half) { 
cortes++;
break ;
}}}
var TPS = 254016000000;
var zoomOk = 0;
var curtos = 0;
for (var z = 0; z < targets.length; z += 1) { 
if (((targets[z].end - targets[z].start) / TPS) > 0.04) { 
zoomOk++;
}
else {
curtos++;
}}
var autoZoom = _fsDynAutoZoom(targets, TPS, o.intensidade).length;
var elegT = [];
for (var e1 = 0; e1 < targets.length; e1 += 1) { 
for (var e2 = 0; e2 < targets.length; e2 += 1) { 
if (e2 === e1) { 
continue ;
}
if (targets[e2].track !== targets[e1].track) { 
continue ;
}
if (Math.abs(targets[e2].end - targets[e1].start) <= half) { 
elegT.push(targets[e1]);
break ;
}}}
var autoCortes = _fsDynAutoCortes(elegT, TPS, _fsDynEspaco(o.intensidade)).length;
return _fsJSON.stringify({autoCortes: autoCortes, autoZoom: autoZoom, clipes: targets.length, cortes: cortes, curtos: curtos, ok: true, zoomOk: zoomOk});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsFxCountTargets(scope) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var t = _fsFxTargets(seq, (scope) || ("selected"));
return _fsJSON.stringify({clipes: t.length, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsSbTexto(mgt) {
var partes = [];
var props = null;
try {
props = mgt.properties;
} catch (e) {return "";
}
var n = 0;
try {
n = props.numItems;
} catch (e2) {return "";
}
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = props[i];
} catch (eP) {continue ;
}
if (!p) { 
continue ;
}
try {
v = p.getValue();
} catch (eV) {continue ;
}
if ((typeof v !== "string") || (v.indexOf("textEditValue") === -1)) { 
continue ;
}
var o = null;
try {
o = _fsJSON.parse(v);
} catch (eJ) {continue ;
}
if ((!o) || (typeof o.textEditValue !== "string")) { 
continue ;
}
var t = o.textEditValue;
try {
t = t.replace(/^\s+|\s+$/g, "");
} catch (eT) {
}
if (t !== "") { 
partes.push(t);
}}
return partes.join(" ");
}
function _fsSbNumLinha(nome) {
var s = (nome) || ("").toUpperCase();
var m = s.match(/TEXTO?\s*(\d+)/);
if (((!m) && (s.indexOf("TIME") !== -1)) && (s.indexOf("ANIMATION") !== -1)) { 
m = s.match(/(\d+)\s*$/);
}
if (!m) { 
return 0;
}
var n = parseInt(m[1], 10);
return isNaN(n) ? 0 : n;
}
function _fsSbEhTempoLinha(nome) {
var s = (nome) || ("").toUpperCase();
return (s.indexOf("TIME") !== -1) && (s.indexOf("ANIMATION") !== -1);
}
function _fsSbEhTempoGeral(nome) {
var s = (nome) || ("").toUpperCase();
return (s.indexOf("TIME") !== -1) && (s.indexOf("ALL") !== -1);
}
function _fsSbLinhas(mgt) {
function _descer(lista, prof, numHerdado) {
var n = 0;
try {
n = lista.numItems;
} catch (e2) {return;
}
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = lista[i];
} catch (eP) {continue ;
}
if (!p) { 
continue ;
}
var filhos = 0;
try {
filhos = (p.numItems) || (0);
} catch (eF) {filhos = 0;
}
if ((filhos > 0) && (prof < 4)) { 
var nomeGrupo = "";
try {
nomeGrupo = String((p.displayName) || (""));
} catch (eNg) {
}
_descer(p, prof + 1, ((_fsSbNumLinha(nomeGrupo)) || (numHerdado)) || (0));
continue ;
}
var nome = "";
try {
nome = String((p.displayName) || (""));
} catch (eN) {continue ;
}
if (_fsSbEhTempoGeral(nome)) { 
try {
var vg = parseFloat(p.getValue());
if (!isNaN(vg)) { 
geral = vg;
temGeral = true;
}
} catch (eG) {
}
continue ;
}
var num = ((_fsSbNumLinha(nome)) || (numHerdado)) || (0);
if (!num) { 
continue ;
}
if (!porLinha[num]) { 
porLinha[num] = {n: num, t: null, texto: ""};
}
if (_fsSbEhTempoLinha(nome)) { 
try {
var vt = parseFloat(p.getValue());
if (!isNaN(vt)) { 
porLinha[num].t = vt;
}
} catch (eT) {
}
continue ;
}
try {
v = p.getValue();
} catch (eV) {continue ;
}
if ((typeof v !== "string") || (v.indexOf("textEditValue") === -1)) { 
continue ;
}
var o = null;
try {
o = _fsJSON.parse(v);
} catch (eJ) {continue ;
}
if ((!o) || (typeof o.textEditValue !== "string")) { 
continue ;
}
var t = o.textEditValue;
try {
t = t.replace(/^\s+|\s+$/g, "");
} catch (eR) {
}
if (t !== "") { 
porLinha[num].texto = t;
}}
}
var props = null;
try {
props = mgt.properties;
} catch (e) {return {geral: 0, linhas: []};
}
var porLinha = {};
var geral = 0;
var temGeral = false;
_descer(props, 0, 0);
var lista = [];
for (var k in porLinha) { 
if (!porLinha.hasOwnProperty(k)) { 
continue ;
}
if (porLinha[k].texto !== "") { 
lista.push(porLinha[k]);
}
}
lista.sort(function (a, b) {
return a.n - b.n;
});
return {geral: temGeral ? geral : 0, linhas: lista};
}
function fsSfxBlocos(scope, somJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Abra uma sequ\xeancia."});
}
var somCaminhos = {};
var somNomes = {};
var temLista = false;
try {
var lst = somJson ? _fsJSON.parse(somJson) : null;
if ((lst) && (lst.length)) { 
for (var si = 0; si < lst.length; si += 1) { 
var sN = _fsNormCaminho(lst[si]);
if (!sN) { 
continue ;
}
temLista = true;
somCaminhos[sN] = 1;
somNomes[sN.split("/").pop()] = 1;}
}
} catch (eSj) {
}
var iniciosSom = [];
if (temLista) { 
for (var at = 0; at < seq.audioTracks.numTracks; at += 1) { 
var atr = null;
try {
atr = seq.audioTracks[at];
} catch (eAt) {continue ;
}
if (!atr) { 
continue ;
}
for (var ac = 0; ac < atr.clips.numItems; ac += 1) { 
var acl = null;
try {
acl = atr.clips[ac];
} catch (eAc) {continue ;
}
if (!acl) { 
continue ;
}
var mpA = "";
try {
if ((acl.projectItem) && (acl.projectItem.getMediaPath)) { 
mpA = String(acl.projectItem.getMediaPath());
}
} catch (eMpA) {mpA = "";
}
mpA = _fsNormCaminho(mpA);
if (!mpA) { 
continue ;
}
if ((somCaminhos[mpA] === 1) || (somNomes[mpA.split("/").pop()] === 1)) { 
var sIni = NaN;
try {
sIni = parseFloat(acl.start.seconds);
} catch (eSi) {continue ;
}
if (!isNaN(sIni)) { 
iniciosSom.push(sIni);
}
}}}
}
var comSomProprio = 0;
var fps = 0;
try {
var tpfB = parseFloat(seq.timebase);
if (tpfB > 0) { 
fps = 254016000000 / tpfB;
}
} catch (eFps) {fps = 0;
}
var blocos = [];
var semTexto = 0;
var vistos = 0;
var semMgt = 0;
var foraDaSelecao = 0;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
vistos++;
if (scope === "selected") { 
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
foraDaSelecao++;
continue ;
}
}
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (!mgt) { 
semMgt++;
continue ;
}
var ini = 0;
var fim = 0;
try {
ini = parseFloat(cl.start.seconds);
} catch (eI) {continue ;
}
try {
fim = parseFloat(cl.end.seconds);
} catch (eF) {fim = ini;
}
if (!(fim > ini)) { 
continue ;
}
var somProprio = false;
for (var sp = 0; sp < iniciosSom.length; sp += 1) { 
if (Math.abs(iniciosSom[sp] - ini) <= 0.05) { 
somProprio = true;
break ;
}}
if (somProprio) { 
comSomProprio++;
}
var txt = "";
try {
txt = _fsSbTexto(mgt);
} catch (eX) {txt = "";
}
if (txt === "") { 
semTexto++;
}
var info = {geral: 0, linhas: []};
try {
info = _fsSbLinhas(mgt);
} catch (eL) {
}
blocos.push({fim: fim, geral: info.geral, ini: ini, linhas: info.linhas, somProprio: somProprio, texto: txt, trilha: t});}}
blocos.sort(function (a, b) {
return a.ini - b.ini;
});
var comTempo = 0;
for (var q = 0; q < blocos.length; q += 1) { 
var lin = (blocos[q].linhas) || ([]);
var achou = false;
for (var w = 0; w < lin.length; w += 1) { 
if (lin[w].t !== null) { 
achou = true;
}}
if (achou) { 
comTempo++;
}}
return _fsJSON.stringify({blocos: blocos, comSomProprio: comSomProprio, comTempo: comTempo, escopo: scope === "selected" ? "selecionadas" : "todas", foraDaSelecao: foraDaSelecao, fps: fps, ok: true, semMgt: semMgt, semTexto: semTexto, sonsProprios: iniciosSom.length, total: blocos.length, vistos: vistos});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsZBezier(x1, y1, x2, y2, t) {
function cx(u) {
return ((1 - u) * (1 - u) * 3 * u * x1) + ((1 - u) * 3 * u * u * x2) + (u * u * u);
}
function cy(u) {
return ((1 - u) * (1 - u) * 3 * u * y1) + ((1 - u) * 3 * u * u * y2) + (u * u * u);
}
function dcx(u) {
return (3 * (1 - u) * (1 - u) * x1) + (6 * (1 - u) * u * (x2 - x1)) + (3 * u * u * (1 - x2));
}
if (t <= 0) { 
return 0;
}
if (t >= 1) { 
return 1;
}
var u = t;
for (var i = 0; i < 8; i += 1) { 
var x = cx(u) - t;
if (Math.abs(x) < 1e-06) { 
return cy(u);
}
var d = dcx(u);
if (Math.abs(d) < 1e-06) { 
break ;
}
u = u - (x / d);}
var lo = 0;
var hi = 1;
u = t;
for (var j = 0; j < 24; j += 1) { 
var xv = cx(u);
if (Math.abs(xv - t) < 1e-06) { 
break ;
}
if (xv > t) { 
hi = u;
}
else {
lo = u;
}
u = (lo + hi) / 2;}
return cy(u);
}
function _fsZPontos(easeOut, easeIn) {
var a = parseFloat(easeOut);
if (isNaN(a)) { 
a = 25;
}
var b = parseFloat(easeIn);
if (isNaN(b)) { 
b = 50;
}
if (a < 0) { 
a = 0;
}
if (a > 100) { 
a = 100;
}
if (b < 0) { 
b = 0;
}
if (b > 100) { 
b = 100;
}
return {x1: a / 100, x2: 1 - (b / 100), y1: 0, y2: 1};
}
function _fsZLut(lut, t) {
if (t <= 0) { 
return lut[0];
}
if (t >= 1) { 
return lut[lut.length - 1];
}
var f = t * (lut.length - 1);
var i0 = Math.floor(f);
var frac = f - i0;
return lut[i0] + ((lut[i0 + 1] - lut[i0]) * frac);
}
function _fsZChaves(de, para, durAnim, durClipe, modo, suav, easeOut, easeIn, fps, lut) {
function amostra(prog) {
if (temLut) { 
return _fsZLut(lut, prog);
}
return _fsZBezier(p.x1, p.y1, p.x2, p.y2, prog);
}
var chaves = [];
var volta = modo === "volta";
var anim = durAnim;
if (anim <= 0) { 
anim = 0.5;
}
var teto = volta ? durClipe / 2 : durClipe;
if (anim > teto) { 
anim = teto;
}
if (anim <= 0) { 
return chaves;
}
if (suav !== "curva") { 
chaves.push({t: 0, v: de});
chaves.push({t: anim, v: para});
if (volta) { 
chaves.push({t: durClipe - anim, v: para});
chaves.push({t: durClipe, v: de});
}
return chaves;
}
var temLut = !(!((lut) && (lut.length > 1)));
var p = temLut ? null : _fsZPontos(easeOut, easeIn);
var f = fps > 0 ? fps : 30;
var n = Math.round((anim * f) / 2);
if (n < 6) { 
n = 6;
}
if (n > 60) { 
n = 60;
}
for (var i = 0; i <= n; i += 1) { 
var prog = i / n;
chaves.push({t: anim * prog, v: de + ((para - de) * amostra(prog))});}
if (volta) { 
var inicioVolta = durClipe - anim;
for (var k = 0; k <= n; k += 1) { 
var pr = k / n;
chaves.push({t: inicioVolta + (anim * pr), v: para + ((de - para) * amostra(pr))});}
}
return chaves;
}
function _fsZFormatoPonto(prop, larg, alt) {
if (!prop) { 
return "";
}
var v = null;
try {
v = prop.getValue();
} catch (e) {return "";
}
var x = NaN;
var y = NaN;
try {
if (((v) && (typeof v.length === "number")) && (v.length >= 2)) { 
x = parseFloat(v[0]);
y = parseFloat(v[1]);
}
} catch (e2) {return "";
}
if ((isNaN(x)) || (isNaN(y))) { 
return "";
}
if ((Math.abs(x) >= 32767) || (Math.abs(y) >= 32767)) { 
return "";
}
if ((((x >= -2) && (x <= 2)) && (y >= -2)) && (y <= 2)) { 
return "norm";
}
var cx = larg / 2;
var cy = alt / 2;
if ((Math.abs(x - cx) <= (larg * 0.6)) && (Math.abs(y - cy) <= (alt * 0.6))) { 
return "px";
}
return "";
}
function _fsZPontoDoQuadro(prop, ax, ay) {
if (!prop) { 
return null;
}
var v = null;
try {
v = prop.getValue();
} catch (e) {return null;
}
var cx = NaN;
var cy = NaN;
try {
if (((v) && (typeof v.length === "number")) && (v.length >= 2)) { 
cx = parseFloat(v[0]);
cy = parseFloat(v[1]);
}
} catch (e2) {return null;
}
if ((isNaN(cx)) || (isNaN(cy))) { 
return null;
}
if ((Math.abs(cx) >= 32767) || (Math.abs(cy) >= 32767)) { 
return null;
}
if ((cx <= 0) || (cy <= 0)) { 
return null;
}
if ((((cx >= -2) && (cx <= 2)) && (cy >= -2)) && (cy <= 2)) { 
return {altura: 1, fmt: "norm", largura: 1, x: ax, y: ay};
}
if ((cx > 1) && (cy > 1)) { 
return {altura: cy * 2, fmt: "px", largura: cx * 2, x: cx * 2 * ax, y: cy * 2 * ay};
}
return null;
}
function _fsZPonto(prop, x, y) {
if (!prop) { 
return false;
}
var antes = null;
try {
antes = prop.getValue();
} catch (e) {
}
try {
prop.setValue([x, y], true);
} catch (e2) {return false;
}
var lido = null;
try {
lido = prop.getValue();
} catch (e3) {return false;
}
var lx = NaN;
var ly = NaN;
try {
if (((lido) && (typeof lido.length === "number")) && (lido.length >= 2)) { 
lx = parseFloat(lido[0]);
ly = parseFloat(lido[1]);
}
} catch (e4) {
}
var tolX = Math.max(0.01, Math.abs(x) * 0.02);
var tolY = Math.max(0.01, Math.abs(y) * 0.02);
if ((((!isNaN(lx)) && (!isNaN(ly))) && (Math.abs(lx - x) <= tolX)) && (Math.abs(ly - y) <= tolY)) { 
return true;
}
if (antes) { 
try {
prop.setValue(antes, true);
} catch (e5) {
}
}
return false;
}
function _fsZTransform(alvo, half) {
function achar(cl) {
var comps = null;
try {
comps = cl.components;
} catch (e) {return null;
}
if (!comps) { 
return null;
}
for (var i = 0; i < comps.numItems; i += 1) { 
var c = null;
try {
c = comps[i];
} catch (eC) {continue ;
}
if (!c) { 
continue ;
}
var mn = "";
var dn = "";
try {
mn = String(c.matchName);
} catch (eM) {
}
try {
dn = String(c.displayName);
} catch (eD) {
}
if (mn.indexOf("AE.ADBE Geometry") !== -1) { 
return c;
}
var _nomesTf = _fsNomesDe("efeitoTransform");
for (var _nt = 0; _nt < _nomesTf.length; _nt += 1) { 
if (_fsSemAcento(dn) === _fsSemAcento(_nomesTf[_nt])) { 
return c;
}}}
return null;
}
_fsZTfFalha = "";
var comp = achar(alvo.clip);
if (comp) { 
return comp;
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var eff = null;
var qeIt = _fsFxQeItem("v", alvo.track, alvo.start, half);
if (!qeIt) { 
_fsZTfFalha = "n\xe3o achei a camada no motor QE (trilha " + alvo.track + 1 + ")";
return null;
}
var nomesEf = _fsNomesDe("efeitoTransform");
var recusas = "";
for (var nE = 0; nE < nomesEf.length; nE += 1) { 
var eff = null;
try {
eff = qe.project.getVideoEffectByName(nomesEf[nE]);
} catch (e1) {eff = null;
}
if (!_fsFxEfeitoVale(eff, nomesEf[nE])) { 
continue ;
}
try {
qeIt.addVideoEffect(eff);
} catch (eAdd) {recusas += nomesEf[nE] + ": " + String(eAdd) + "; ";
continue ;
}
var achou = achar(alvo.clip);
if (achou) { 
return achou;
}
recusas += nomesEf[nE] + ": aceito mas n\xe3o apareceu; ";}
var listaReal = _fsFxListaEfeitos("v");
for (var iL = 0; iL < listaReal.length; iL += 1) { 
if (_fsFxNormNome(listaReal[iL]).indexOf("transform") === -1) { 
continue ;
}
var effL = null;
try {
effL = qe.project.getVideoEffectByName(listaReal[iL]);
} catch (eL1) {effL = null;
}
if (!_fsFxEfeitoVale(effL, listaReal[iL])) { 
continue ;
}
try {
qeIt.addVideoEffect(effL);
} catch (eL2) {recusas += listaReal[iL] + ": " + String(eL2) + "; ";
continue ;
}
var achou2 = achar(alvo.clip);
if (achou2) { 
return achou2;
}
recusas += listaReal[iL] + ": aceito mas nao apareceu; ";}
var pistas = [];
for (var iP = 0; (iP < listaReal.length) && (pistas.length < 6); iP++) { 
var nrmP = _fsFxNormNome(listaReal[iP]);
if ((nrmP.indexOf("transf") !== -1) || (nrmP.indexOf("geometr") !== -1)) { 
pistas.push(listaReal[iP]);
}}
_fsZTfFalha = recusas ? "o QE nao aplicou o efeito (" + recusas.replace(/; $/, "") + ")" : "nenhum efeito com \'transform\' no nome respondeu" + listaReal.length ? " | a lista do QE tem " + listaReal.length + " efeitos" + pistas.length ? "; os mais parecidos: " + pistas.join(", ") : "; nenhum parecido com Transform" : " | getVideoEffectList() vazio ou indisponivel";
return null;
}
function _fsSemAcento(s) {
s = String((s === null) || (s === undefined) ? "" : s).toLowerCase();
var out = "";
for (var i = 0; i < s.length; i += 1) { 
var c = s.charAt(i);
out += (_FS_ACENTOS[c]) || (c);}
return out.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}
function _fsZProp(comp, nomes, evitar) {
function livre(it) {
return !((proibido[it.n]) || ((it.mn) && (proibido[it.mn])));
}
var props = null;
try {
props = comp.properties;
} catch (e) {return null;
}
if (!props) { 
return null;
}
var lista = [];
for (var i = 0; i < props.numItems; i += 1) { 
var p = null;
try {
p = props[i];
} catch (eP) {continue ;
}
if (!p) { 
continue ;
}
var n = "";
var mn = "";
try {
n = _fsSemAcento(p.displayName);
} catch (eN) {
}
try {
mn = _fsSemAcento(p.matchName);
} catch (eM) {
}
lista.push({mn: mn, n: n, p: p});}
var proibido = {};
if (evitar) { 
for (var v = 0; v < evitar.length; v += 1) { 
proibido[_fsSemAcento(evitar[v])] = 1;}
}
for (var k = 0; k < nomes.length; k += 1) { 
var alvo = _fsSemAcento(nomes[k]);
if (!alvo) { 
continue ;
}
for (var j = 0; j < lista.length; j += 1) { 
if (!livre(lista[j])) { 
continue ;
}
if ((lista[j].n === alvo) || ((lista[j].mn) && (lista[j].mn === alvo))) { 
return lista[j].p;
}}}
for (var k2 = 0; k2 < nomes.length; k2 += 1) { 
var alvo2 = _fsSemAcento(nomes[k2]);
if (alvo2.length < 4) { 
continue ;
}
for (var j2 = 0; j2 < lista.length; j2 += 1) { 
if (!livre(lista[j2])) { 
continue ;
}
if (lista[j2].n.indexOf(alvo2) === 0) { 
return lista[j2].p;
}}}
return null;
}
function _fsZGravar(prop, chaves, tBase, interp) {
if ((!prop) || (!chaves.length)) { 
return 0;
}
try {
if (typeof prop.setTimeVarying === "function") { 
prop.setTimeVarying(true);
}
} catch (e) {
}
var t0 = tBase + chaves[0].t;
var t1 = tBase + chaves[chaves.length - 1].t;
try {
if (typeof prop.removeKeyRange === "function") { 
prop.removeKeyRange(t0 - 0.001, t1 + 0.001);
}
} catch (eR) {
}
var n = 0;
for (var i = 0; i < chaves.length; i += 1) { 
var t = tBase + chaves[i].t;
var ultimo = i === (chaves.length - 1);
try {
prop.addKey(t);
} catch (eA) {continue ;
}
try {
prop.setValueAtKey(t, chaves[i].v, ultimo ? 1 : 0);
} catch (eV) {continue ;
}
try {
prop.setInterpolationTypeAtKey(t, interp, ultimo ? 1 : 0);
} catch (eI) {
}
n++;}
return n;
}
function fsZoomAplicar(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var alvoPct = parseFloat(o.intensidade);
if (isNaN(alvoPct)) { 
alvoPct = 121;
}
var durAnim = parseFloat(o.duracao);
if (isNaN(durAnim)) { 
durAnim = 1.5;
}
var direcao = (o.direcao) || ("in");
var modo = (o.modo) || ("volta");
var suav = (o.suav) || ("curva");
var interp = suav === "linear" ? 0 : suav === "bezier" ? 5 : 0;
var lut = null;
if (o.lut) { 
var partes = String(o.lut).split(",");
lut = [];
for (var iL = 0; iL < partes.length; iL += 1) { 
var vL = parseFloat(partes[iL]);
if (!isNaN(vL)) { 
lut.push(vL);
}}
if (lut.length < 2) { 
lut = null;
}
}
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = _FS_Z_TPS / 30;
}
var half = tpf / 2;
var fps = _FS_Z_TPS / tpf;
var auto = o.scope === "auto";
var targets = _fsDynTargets(seq, auto ? "all" : (o.scope) || ("selected"));
if (!targets.length) { 
return _fsJSON.stringify({error: o.scope === "selected" ? "Nenhum clipe selecionado na timeline." : "Nenhum clipe de v\xeddeo encontrado nas trilhas destravadas."});
}
var achados = targets.length;
var forade = 0;
if (auto) { 
var esc = _fsDynAutoZoom(targets, _FS_Z_TPS, o.intensidade);
forade = achados - esc.length;
targets = esc;
if (!targets.length) { 
return _fsJSON.stringify({error: "Nenhum clipe com dura\xe7\xe3o boa pra zoom (entre 0,6s e 15s)."});
}
}
var larg = 1920;
var alt = 1080;
try {
larg = (parseInt(seq.frameSizeHorizontal, 10)) || (1920);
} catch (eW) {
}
try {
alt = (parseInt(seq.frameSizeVertical, 10)) || (1080);
} catch (eH) {
}
var ax = parseFloat(o.ancoraX);
if (isNaN(ax)) { 
ax = 0.5;
}
var ay = parseFloat(o.ancoraY);
if (isNaN(ay)) { 
ay = 0.5;
}
var mexeAncora = (Math.abs(ax - 0.5) > 0.001) || (Math.abs(ay - 0.5) > 0.001);
var feitos = 0;
var semEfeito = 0;
var semEscala = 0;
var chavesTotal = 0;
var ancoraPulada = 0;
for (var i = 0; i < targets.length; i += 1) { 
var alvo = targets[i];
var comp = _fsZTransform(alvo, half);
if (!comp) { 
semEfeito++;
continue ;
}
var durClipe = (alvo.end - alvo.start) / _FS_Z_TPS;
var tBase = 0;
try {
tBase = parseFloat(alvo.clip.inPoint.seconds);
} catch (eIn) {tBase = 0;
}
if (isNaN(tBase)) { 
tBase = 0;
}
var dir = direcao;
if (direcao === "alternate") { 
dir = (i % 2) === 0 ? "in" : "out";
}
var de = dir === "out" ? alvoPct : 100;
var para = dir === "out" ? 100 : alvoPct;
if (mexeAncora) { 
var pAnc = _fsZProp(comp, _fsNomesDe("propAncora"));
var pPos = _fsZProp(comp, _fsNomesDe("propPosicao"));
var fmt = _fsZFormatoPonto(pAnc, larg, alt);
if (fmt === "norm") { 
_fsZPonto(pAnc, ax, ay);
_fsZPonto(pPos, ax, ay);
}
else if (fmt === "px") {
_fsZPonto(pAnc, larg * ax, alt * ay);
_fsZPonto(pPos, larg * ax, alt * ay);
}
else {
ancoraPulada++;
}
}
if (o.blur) { 
var pUsa = _fsZProp(comp, ["use composition\'s shutter angle", "utilizar angulo do obturador da composicao", "usar o \xe2ngulo do obturador da composi\xe7\xe3o"]);
if (pUsa) { 
try {
pUsa.setValue(false, true);
} catch (eU) {
}
}
var pSh = _fsZProp(comp, _fsNomesDe("propObturador"));
if (pSh) { 
try {
pSh.setValue(180, true);
} catch (eS) {
}
}
}
var chaves = _fsZChaves(de, para, durAnim, durClipe, modo, suav, o.easeOut, o.easeIn, fps, lut);
if (!chaves.length) { 
semEscala++;
continue ;
}
var pU = _fsZProp(comp, _fsNomesDe("propEscalaUnif"));
if (pU) { 
try {
pU.setValue(true, true);
} catch (eUn) {
}
}
var pH = _fsZProp(comp, _fsNomesDe("propEscala"), _fsNomesDe("propEscalaUnif"));
var pW = _fsZProp(comp, _fsNomesDe("propEscalaLarg"), _fsNomesDe("propEscalaUnif"));
var n1 = _fsZGravar(pH, chaves, tBase, interp);
var n2 = 0;
if (pW) { 
n2 = _fsZGravar(pW, chaves, tBase, interp);
}
if ((n1) || (n2)) { 
feitos++;
chavesTotal += n1 + n2;
}
else {
semEscala++;
}}
var res = {achados: achados, ancoraPulada: ancoraPulada, auto: auto ? 1 : 0, chaves: chavesTotal, clipes: targets.length, feitos: feitos, forade: forade, ok: true, semEfeito: semEfeito, semEscala: semEscala, suav: suav};
if (!feitos) { 
res.warning = semEfeito ? "N\xe3o consegui adicionar o efeito Transform. Confira se ele existe na aba Efeitos do seu Premiere." : "Nenhum zoom foi gravado.";
}
else {
if (semEfeito) { 
res.warning = semEfeito + " clipe(s) ficaram sem o efeito Transform.";
}
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsZoomLimpar(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eT) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = _FS_Z_TPS / 30;
}
var targets = _fsDynTargets(seq, o.scope === "auto" ? "all" : (o.scope) || ("selected"));
var larg = 1920;
var alt = 1080;
try {
larg = (parseInt(seq.frameSizeHorizontal, 10)) || (1920);
} catch (eW2) {
}
try {
alt = (parseInt(seq.frameSizeVertical, 10)) || (1080);
} catch (eH2) {
}
var limpos = 0;
var consertados = 0;
for (var i = 0; i < targets.length; i += 1) { 
var comp = null;
try {
comp = _fsZTransform({clip: targets[i].clip, start: targets[i].start, track: targets[i].track}, tpf / 2);
} catch (eC) {comp = null;
}
if (!comp) { 
continue ;
}
var mexeu = false;
var nomes = [_fsNomesDe("propEscala"), _fsNomesDe("propEscalaLarg")];
for (var k = 0; k < nomes.length; k += 1) { 
var p = _fsZProp(comp, nomes[k], _fsNomesDe("propEscalaUnif"));
if (!p) { 
continue ;
}
try {
if ((typeof p.isTimeVarying === "function") && (p.isTimeVarying())) { 
p.setTimeVarying(false);
mexeu = true;
}
} catch (eV) {
}
try {
p.setValue(100, true);
} catch (eS) {
}}
var pontos = [["anchor point", "ponto de ancoragem"], ["position", "posi\xe7\xe3o", "posicao"]];
for (var q = 0; q < pontos.length; q += 1) { 
var pp = _fsZProp(comp, pontos[q]);
if (!pp) { 
continue ;
}
var vv = null;
try {
vv = pp.getValue();
} catch (eG) {continue ;
}
var vx = NaN;
var vy = NaN;
try {
if (((vv) && (typeof vv.length === "number")) && (vv.length >= 2)) { 
vx = parseFloat(vv[0]);
vy = parseFloat(vv[1]);
}
} catch (eL) {
}
if ((isNaN(vx)) || (isNaN(vy))) { 
continue ;
}
if ((Math.abs(vx) < 32767) && (Math.abs(vy) < 32767)) { 
continue ;
}
if (_fsZPonto(pp, 0.5, 0.5)) { 
consertados++;
mexeu = true;
}
else {
if (_fsZPonto(pp, larg / 2, alt / 2)) { 
consertados++;
mexeu = true;
}
}}
if (mexeu) { 
limpos++;
}}
return _fsJSON.stringify({clipes: targets.length, consertados: consertados, limpos: limpos, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsZEhNossaCamada(clip) {
var item = null;
try {
item = clip.projectItem;
} catch (e) {return false;
}
if (!_fsCaEhAjuste(item)) { 
return false;
}
var comps = null;
try {
comps = clip.components;
} catch (e2) {return false;
}
if (!comps) { 
return false;
}
for (var i = 0; i < comps.numItems; i += 1) { 
var c = null;
try {
c = comps[i];
} catch (eC) {continue ;
}
if (!c) { 
continue ;
}
var mn = "";
try {
mn = String(c.matchName);
} catch (eM) {
}
var ehTf = mn.indexOf("AE.ADBE Geometry") !== -1;
if (!ehTf) { 
var dn = "";
try {
dn = _fsSemAcento(c.displayName);
} catch (eD) {
}
var nomesTf = _fsNomesDe("efeitoTransform");
for (var t = 0; (t < nomesTf.length) && (!ehTf); t++) { 
if (dn === _fsSemAcento(nomesTf[t])) { 
ehTf = true;
}}
}
if (!ehTf) { 
continue ;
}
var esc = _fsZProp(c, _fsNomesDe("propEscala"), _fsNomesDe("propEscalaUnif"));
if (!esc) { 
continue ;
}
try {
if ((typeof esc.isTimeVarying === "function") && (esc.isTimeVarying())) { 
return true;
}
} catch (eV) {
}}
return false;
}
function fsZoomDesfazer(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var removidas = 0;
var travadas = 0;
var ajustesMantidos = 0;
var vts = seq.videoTracks;
for (var t = 0; t < vts.numTracks; t += 1) { 
var tr = null;
try {
tr = vts[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var trancada = false;
try {
trancada = typeof tr.isLocked === "function" ? tr.isLocked() : false;
} catch (eL) {
}
if (trancada) { 
travadas++;
continue ;
}
for (var c = tr.clips.numItems - 1; c >= 0; c--) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var ehAjuste = false;
try {
ehAjuste = _fsCaEhAjuste(cl.projectItem);
} catch (eA) {
}
if (!ehAjuste) { 
continue ;
}
if (_fsZEhNossaCamada(cl)) { 
try {
cl.remove(false, false);
removidas++;
} catch (eR) {
}
}
else {
ajustesMantidos++;
}}}
return _fsJSON.stringify({ajustesMantidos: ajustesMantidos, ok: true, removidas: removidas, travadas: travadas});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsCaEhAjuste(item) {
if (!item) { 
return false;
}
try {
if (typeof item.isAdjustmentLayer === "function") { 
if (item.isAdjustmentLayer()) { 
return true;
}
}
} catch (e) {
}
var n = "";
try {
n = String((item.name) || ("")).toLowerCase();
} catch (e2) {return false;
}
return (n.indexOf("adjustment layer") !== -1) || (n.indexOf("camada de ajuste") !== -1);
}
function _fsCaProcurar(pasta, achados) {
var n = 0;
try {
n = pasta.children.numItems;
} catch (e) {return;
}
for (var i = 0; i < n; i += 1) { 
var it = null;
try {
it = pasta.children[i];
} catch (eI) {continue ;
}
if (!it) { 
continue ;
}
var tipo = 0;
try {
tipo = it.type;
} catch (eT) {tipo = 0;
}
if (tipo === ProjectItemType.BIN) { 
_fsCaProcurar(it, achados);
continue ;
}
if (_fsCaEhAjuste(it)) { 
achados.push(it);
}}
}
function fsCamadaAjuste() {
try {
var proj = app.project;
if (!proj) { 
return _fsJSON.stringify({error: "Nenhum projeto aberto."});
}
var achados = [];
_fsCaProcurar(proj.rootItem, achados);
if (!achados.length) { 
return _fsJSON.stringify({ok: true, tem: false});
}
var nome = "";
try {
nome = String((achados[0].name) || (""));
} catch (eN) {
}
return _fsJSON.stringify({nome: nome, ok: true, quantas: achados.length, tem: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsCaLivre(seq, trilhaIdx, iniTicks, fimTicks, half) {
var tr = null;
try {
tr = seq.videoTracks[trilhaIdx];
} catch (e) {return false;
}
if (!tr) { 
return false;
}
try {
if (tr.isLocked()) { 
return false;
}
} catch (eL) {
}
var n = 0;
try {
n = tr.clips.numItems;
} catch (eN) {return false;
}
for (var i = 0; i < n; i += 1) { 
var cl = null;
try {
cl = tr.clips[i];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var s = NaN;
var e2 = NaN;
try {
s = parseFloat(cl.start.ticks);
e2 = parseFloat(cl.end.ticks);
} catch (eP) {continue ;
}
if ((isNaN(s)) || (isNaN(e2))) { 
continue ;
}
if ((s < (fimTicks - half)) && (e2 > (iniTicks + half))) { 
return false;
}}
return true;
}
function _fsCaTrilhaLivre(seq, apartir, iniTicks, fimTicks, half) {
var n = 0;
try {
n = seq.videoTracks.numTracks;
} catch (eN) {return -1;
}
for (var t = apartir; t < n; t++) { 
if (_fsCaLivre(seq, t, iniTicks, fimTicks, half)) { 
return t;
}}
return -1;
}
function _fsZTrilhaDestino(seq, clipeTrack, preferida, iniTicks, fimTicks, half, estado) {
var base = preferida >= 0 ? preferida : clipeTrack + 1;
if (base <= clipeTrack) { 
base = clipeTrack + 1;
}
var t = _fsCaTrilhaLivre(seq, base, iniTicks, fimTicks, half);
if (t >= 0) { 
return t;
}
if ((!estado) || (!estado.criar)) { 
return -1;
}
if (estado.criadas >= estado.teto) { 
return -1;
}
if (!estado.criar(seq)) { 
estado.falhouCriar = 1;
return -1;
}
estado.criadas++;
return _fsCaTrilhaLivre(seq, base, iniTicks, fimTicks, half);
}
function fsImportarCamadaAjuste(prprojPath) {
try {
var proj = app.project;
if (!proj) { 
return _fsJSON.stringify({error: "Nenhum projeto aberto."});
}
var achados = [];
_fsCaProcurar(proj.rootItem, achados);
if (achados.length) { 
var nm = "";
try {
nm = String((achados[0].name) || (""));
} catch (eN0) {
}
return _fsJSON.stringify({importou: false, nome: nm, ok: true, tem: true});
}
var f = new File(prprojPath);
if (!f.exists) { 
return _fsJSON.stringify({caminho: prprojPath, error: "SEM_ARQUIVO"});
}
var antes = 0;
try {
antes = proj.rootItem.children.numItems;
} catch (eA) {
}
var okImp = false;
try {
okImp = proj.importFiles([f.fsName], true, proj.rootItem, false);
} catch (eI) {okImp = false;
}
if (!okImp) { 
try {
okImp = proj.importFiles([f.fsName]);
} catch (eI2) {okImp = false;
}
}
achados = [];
_fsCaProcurar(proj.rootItem, achados);
if (!achados.length) { 
var depois = 0;
try {
depois = proj.rootItem.children.numItems;
} catch (eD) {
}
return _fsJSON.stringify({error: "O arquivo foi importado mas n\xe3o achei camada de ajuste dentro dele.", itensAntes: antes, itensDepois: depois});
}
var nome = "";
try {
nome = String((achados[0].name) || (""));
} catch (eN) {
}
return _fsJSON.stringify({importou: true, nome: nome, ok: true, tem: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsAddTrilhaVideoEm(seq, idx) {
try {
function _subiuEm() {
var agora = -1;
try {
agora = seq.videoTracks.numTracks;
} catch (eN2) {return false;
}
return agora > antes;
}
if (!seq) { 
return false;
}
var antes = -1;
try {
antes = seq.videoTracks.numTracks;
} catch (eN) {return false;
}
if (((antes < 0) || (idx < 0)) || (idx > antes)) { 
return false;
}
var qs = null;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (e2) {
}
try {
qs = qe.project.getActiveSequence();
} catch (e3) {qs = null;
}
if ((qs) && (qs.addTracks)) { 
try {
qs.addTracks(1, idx, 0, 0, 0, 0, 0);
} catch (e4) {
}
if (_subiuEm()) { 
return true;
}
try {
qs.addTracks(1, idx, 0, 0, 0, 0);
} catch (e5) {
}
if (_subiuEm()) { 
return true;
}
try {
qs.addTracks(1, idx, 0, 0);
} catch (e6) {
}
if (_subiuEm()) { 
return true;
}
try {
qs.addTracks(1, idx);
} catch (e7) {
}
if (_subiuEm()) { 
return true;
}
}
return false;
} catch (e) {return false;
}
}
function _fsZTrilhaUnica(seq, alvos, TPS, preferida, posicao) {
try {
function livre(idx) {
try {
var tr = seq.videoTracks[idx];
if (!tr) { 
return false;
}
try {
if (tr.isLocked()) { 
return false;
}
} catch (eL) {
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = tr.clips[c];
if ((cl.start.seconds < fim) && (cl.end.seconds > ini)) { 
return false;
}}
return true;
} catch (eT) {return false;
}
}
if ((!alvos) || (!alvos.length)) { 
return -1;
}
var ini = null;
var fim = null;
for (var i = 0; i < alvos.length; i += 1) { 
var aS = alvos[i].start / TPS;
var aE = alvos[i].end / TPS;
if ((ini === null) || (aS < ini)) { 
ini = aS;
}
if ((fim === null) || (aE > fim)) { 
fim = aE;
}}
if ((((typeof preferida === "number") && (preferida >= 0)) && (preferida < seq.videoTracks.numTracks)) && (livre(preferida))) { 
return preferida;
}
if (posicao === "abaixo") { 
var alvoMax = -1;
for (var am = 0; am < alvos.length; am += 1) { 
var tA = typeof alvos[am].track === "number" ? alvos[am].track : -1;
if (tA > alvoMax) { 
alvoMax = tA;
}}
var corredor = alvoMax + 1;
if (corredor >= 0) { 
if ((corredor < seq.videoTracks.numTracks) && (livre(corredor))) { 
return corredor;
}
if (_fsAddTrilhaVideoEm(seq, corredor)) { 
return corredor;
}
}
}
var topo = seq.videoTracks.numTracks - 1;
if ((topo >= 0) && (livre(topo))) { 
return topo;
}
var antes = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
if (seq.videoTracks.numTracks > antes) { 
return seq.videoTracks.numTracks - 1;
}
return -1;
} catch (e) {return -1;
}
}
function _fsZGeometriaCobrir(sw, sh, cw, ch) {
sw = (parseInt(sw, 10)) || (0);
sh = (parseInt(sh, 10)) || (0);
cw = (parseInt(cw, 10)) || (0);
ch = (parseInt(ch, 10)) || (0);
if ((sw <= 0) || (sh <= 0)) { 
return null;
}
if ((cw <= 0) || (ch <= 0)) { 
cw = 1;
ch = 1;
}
var fx = sw / cw;
var fy = sh / ch;
var encaixe = fx < fy ? fx : fy;
var w0 = cw * encaixe;
var h0 = ch * encaixe;
var gx = sw / w0;
var gy = sh / h0;
var fator = gx > gy ? gx : gy;
var escala = Math.ceil(fator * 100) + 1;
if (escala < 100) { 
escala = 100;
}
return {encaixe: encaixe, escala: escala, h: (h0 * escala) / 100, sh: sh, sw: sw, w: (w0 * escala) / 100};
}
function _fsZAncoraNaCamada(ax, ay, sw, sh, geo) {
if (((!geo) || (!geo.w)) || (!geo.h)) { 
return {x: ax, y: ay};
}
return {x: 0.5 + ((ax - 0.5) * (sw / geo.w)), y: 0.5 + ((ay - 0.5) * (sh / geo.h))};
}
function _fsZCobrirCamada(nova, geo) {
var r = {cobriu: false, encaixou: false, lido: null, motivo: ""};
if (!geo) { 
r.motivo = "semGeo";
return r;
}
try {
nova.setScaleToFrameSize();
r.encaixou = true;
} catch (eEnc) {r.encaixou = false;
}
var compMo = _fsAchaCompMovimento(nova);
if (!compMo) { 
r.motivo = "semProp";
return r;
}
var pEsc = _fsZProp(compMo, _fsNomesDe("propEscala"), _fsNomesDe("propEscalaUnif"));
if (!pEsc) { 
r.motivo = "semProp";
return r;
}
var escreveu = false;
try {
pEsc.setValue(geo.escala, true);
escreveu = true;
} catch (eE1) {
}
if (!escreveu) { 
try {
pEsc.setValue(geo.escala);
escreveu = true;
} catch (eE2) {
}
}
if (!escreveu) { 
r.motivo = "recusou";
return r;
}
var lido = NaN;
try {
lido = parseFloat(pEsc.getValue());
} catch (eL) {
}
r.lido = isNaN(lido) ? null : lido;
if ((!isNaN(lido)) && (Math.abs(lido - geo.escala) > 0.5)) { 
r.motivo = "recusou";
return r;
}
r.cobriu = true;
return r;
}
function fsZoomCamada(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var achados = [];
_fsCaProcurar(app.project.rootItem, achados);
if (!achados.length) { 
return _fsJSON.stringify({error: "SEM_CAMADA"});
}
var modelo = achados[0];
var TPS = 254016000000;
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eTb) {
}
if ((!tpf) || (tpf <= 0)) { 
tpf = TPS / 30;
}
var half = tpf / 2;
var fps = TPS / tpf;
var auto = o.scope === "auto";
var alvos = _fsDynTargets(seq, auto ? "all" : (o.scope) || ("selected"));
if (!alvos.length) { 
return _fsJSON.stringify({error: "Nenhum clipe de v\xeddeo encontrado."});
}
var achadosN = alvos.length;
var forade = 0;
if (auto) { 
var esc = _fsDynAutoZoom(alvos, TPS, o.intensidade);
forade = achadosN - esc.length;
alvos = esc;
if (!alvos.length) { 
return _fsJSON.stringify({error: "Nenhum clipe com dura\xe7\xe3o boa pra zoom."});
}
}
var preferida = parseInt(o.trilha, 10);
if (isNaN(preferida)) { 
preferida = -1;
}
var estadoTr = {criadas: 0, criar: function (s) {
return _fsAddTrilhaVideo(s);
}, falhouCriar: 0, teto: 4};
var desviadas = 0;
var avisoTam = "";
var sw = 0;
var sh = 0;
var cw = 0;
var ch = 0;
try {
sw = (parseInt(seq.frameSizeHorizontal, 10)) || (0);
} catch (eSw) {
}
try {
sh = (parseInt(seq.frameSizeVertical, 10)) || (0);
} catch (eSh) {
}
try {
cw = (parseInt(modelo.getFootageInterpretation().frameWidth, 10)) || (0);
} catch (eFw) {
}
try {
ch = (parseInt(modelo.getFootageInterpretation().frameHeight, 10)) || (0);
} catch (eFh) {
}
var geo = _fsZGeometriaCobrir(sw, sh, cw, ch);
var precisaCobrir = geo ? geo.escala : 0;
if (!geo) { 
avisoTam = "N\xe3o consegui ler o tamanho da sequ\xeancia (" + sw + "x" + sh + "), ent\xe3o n\xe3o garanti que a camada cobre o quadro. Se o zoom sair s\xf3 no meio, \xe9 isso.";
}
var postas = 0;
var semEfeito = 0;
var semEscala = 0;
var chavesTotal = 0;
var semTrilha = 0;
var foraDoLugar = 0;
var cobriu = 0;
var cobrirRecusou = 0;
var cobrirSemProp = 0;
var encaixeFalhou = 0;
var escalas = [];
var clipesEscalados = 0;
var abaixoDoClipe = 0;
var chavesConferidas = 0;
var chavesNaoLidas = 0;
var falhaEfeito = "";
var trilhasUsadas = {};
var interp = o.suav === "bezier" ? 5 : 0;
var lut = null;
if (o.lut) { 
var partes = String(o.lut).split(",");
lut = [];
for (var iL = 0; iL < partes.length; iL += 1) { 
var vL = parseFloat(partes[iL]);
if (!isNaN(vL)) { 
lut.push(vL);
}}
if (lut.length < 2) { 
lut = null;
}
}
var ax = parseFloat(o.ancoraX);
if (isNaN(ax)) { 
ax = 0.5;
}
var ay = parseFloat(o.ancoraY);
if (isNaN(ay)) { 
ay = 0.5;
}
var mexeAncora = (Math.abs(ax - 0.5) > 0.001) || (Math.abs(ay - 0.5) > 0.001);
var ancC = _fsZAncoraNaCamada(ax, ay, sw, sh, geo);
var axC = ancC.x;
var ayC = ancC.y;
var ancoraPulada = 0;
var ancoraPosta = 0;
var ancoraRecusada = 0;
var ancoraSemProp = 0;
var ancoraQuadro = "";
var alvoPct = parseFloat(o.intensidade2);
if (isNaN(alvoPct)) { 
alvoPct = parseFloat(o.intensidadeZoom);
}
if (isNaN(alvoPct)) { 
alvoPct = 121;
}
var durAnim = parseFloat(o.duracao);
if (isNaN(durAnim)) { 
durAnim = 1.5;
}
var modo = (o.modo) || ("volta");
var direcao = (o.direcao) || ("in");
var variarModo = !(!o.variar);
var posicaoZoom = o.pos === "abaixo" ? "abaixo" : "acima";
var trilhaUnica = _fsZTrilhaUnica(seq, alvos, TPS, preferida, posicaoZoom);
for (var i = 0; i < alvos.length; i += 1) { 
var modoAlvo = variarModo ? (i % 2) === 1 ? "segura" : "volta" : modo;
var alvo = alvos[i];
var ini = alvo.start / TPS;
var fim = alvo.end / TPS;
var destino = trilhaUnica >= 0 ? trilhaUnica : _fsZTrilhaDestino(seq, alvo.track, preferida, alvo.start, alvo.end, half, estadoTr);
if (destino < 0) { 
semTrilha++;
continue ;
}
if ((preferida >= 0) && (destino !== preferida)) { 
desviadas++;
}
trilhasUsadas["V" + destino + 1] = 1;
var escAlvo = NaN;
try {
var pEscAlvo = _fsDynScaleProp(alvo.clip);
if (pEscAlvo) { 
escAlvo = parseFloat(pEscAlvo.getValue());
}
} catch (eEa) {escAlvo = NaN;
}
if (!isNaN(escAlvo)) { 
escalas.push(Math.round(escAlvo));
if (Math.abs(escAlvo - 100) > 0.5) { 
clipesEscalados++;
}
}
if (destino <= alvo.track) { 
abaixoDoClipe++;
}
var trDest = null;
try {
trDest = seq.videoTracks[destino];
} catch (eTd) {trDest = null;
}
if (!trDest) { 
semTrilha++;
continue ;
}
var antes = 0;
try {
antes = trDest.clips.numItems;
} catch (eC1) {antes = 0;
}
try {
trDest.overwriteClip(modelo, ini);
} catch (eOv) {semEfeito++;
continue ;
}
var depois = 0;
try {
depois = trDest.clips.numItems;
} catch (eC2) {depois = 0;
}
if (depois <= antes) { 
semEfeito++;
continue ;
}
var nova = null;
try {
for (var c = 0; c < trDest.clips.numItems; c += 1) { 
var cl = trDest.clips[c];
if (Math.abs(parseFloat(cl.start.ticks) - alvo.start) <= half) { 
nova = cl;
break ;
}}
} catch (eF) {
}
if (!nova) { 
semEfeito++;
continue ;
}
try {
nova.end = _fsAcTimeTicks(alvo.end);
} catch (eE) {try {
nova.end = alvo.clip.end;
} catch (eE2) {
}
}
var okTempo = false;
try {
var ds = Math.abs(parseFloat(nova.start.ticks) - alvo.start);
var de2 = Math.abs(parseFloat(nova.end.ticks) - alvo.end);
okTempo = (ds <= half) && (de2 <= half);
} catch (eV) {
}
if (!okTempo) { 
foraDoLugar++;
}
var cob = _fsZCobrirCamada(nova, geo);
if (cob.cobriu) { 
cobriu++;
}
else if (cob.motivo === "semProp") {
cobrirSemProp++;
}
else {
if (cob.motivo === "recusou") { 
cobrirRecusou++;
}
}
if ((geo) && (!cob.encaixou)) { 
encaixeFalhou++;
}
var comp = _fsZTransform({clip: nova, start: alvo.start, track: destino}, half);
if (!comp) { 
semEfeito++;
if (!falhaEfeito) { 
falhaEfeito = _fsZTfFalha;
}
continue ;
}
if (mexeAncora) { 
var pAnc = _fsZProp(comp, _fsNomesDe("propAncora"));
var pPos = _fsZProp(comp, _fsNomesDe("propPosicao"));
var alvoA = _fsZPontoDoQuadro(pAnc, axC, ayC);
var alvoP = _fsZPontoDoQuadro(pPos, axC, ayC);
if ((!alvoA) || (!alvoP)) { 
ancoraPulada++;
}
else {
var okA = _fsZPonto(pAnc, alvoA.x, alvoA.y);
var okP = _fsZPonto(pPos, alvoP.x, alvoP.y);
if ((okA) && (okP)) { 
ancoraPosta++;
ancoraQuadro = Math.round(alvoA.largura) + "x" + Math.round(alvoA.altura);
}
else if ((!pAnc) || (!pPos)) {
ancoraSemProp++;
}
else {
ancoraRecusada++;
}
}
}
var dir = direcao;
if (direcao === "alternate") { 
dir = (i % 2) === 0 ? "in" : "out";
}
var de = dir === "out" ? alvoPct : 100;
var para = dir === "out" ? 100 : alvoPct;
var durClipe = fim - ini;
var tBase = 0;
try {
tBase = parseFloat(nova.inPoint.seconds);
} catch (eIn) {tBase = 0;
}
if (isNaN(tBase)) { 
tBase = 0;
}
var chaves = _fsZChaves(de, para, durAnim, durClipe, modoAlvo, (o.suav) || ("curva"), o.easeOut, o.easeIn, fps, lut);
if (!chaves.length) { 
semEscala++;
continue ;
}
var pU = _fsZProp(comp, _fsNomesDe("propEscalaUnif"));
if (pU) { 
try {
pU.setValue(true, true);
} catch (eUn) {
}
}
var pH = _fsZProp(comp, _fsNomesDe("propEscala"), _fsNomesDe("propEscalaUnif"));
var pW = _fsZProp(comp, _fsNomesDe("propEscalaLarg"), _fsNomesDe("propEscalaUnif"));
var n1 = _fsZGravar(pH, chaves, tBase, interp);
var n2 = 0;
if (pW) { 
n2 = _fsZGravar(pW, chaves, tBase, interp);
}
if ((n1) || (n2)) { 
postas++;
chavesTotal += n1 + n2;
var pConf = (pH) || (pW);
var c0 = chaves[0];
var cN = chaves[chaves.length - 1];
if (((pConf) && (_fsDynGravou(pConf, tBase + c0.t, c0.v))) && (_fsDynGravou(pConf, tBase + cN.t, cN.v))) { 
chavesConferidas++;
}
else {
chavesNaoLidas++;
}
}
else {
semEscala++;
}}
var listaTr = [];
for (var kt in trilhasUsadas) { 
if (trilhasUsadas.hasOwnProperty(kt)) { 
listaTr.push(kt);
}
}
listaTr.sort();
var res = {abaixoDoClipe: abaixoDoClipe, achados: achadosN, ancoraPosta: ancoraPosta, ancoraPulada: ancoraPulada, ancoraQuadro: ancoraQuadro, ancoraRecusada: ancoraRecusada, ancoraSemProp: ancoraSemProp, ancoraX: ax, ancoraY: ay, auto: auto ? 1 : 0, camada: 1, camadaTela: geo ? Math.round(geo.w) + "x" + Math.round(geo.h) : "", chaves: chavesTotal, chavesConferidas: chavesConferidas, chavesNaoLidas: chavesNaoLidas, clipes: alvos.length, clipesEscalados: clipesEscalados, cobertura: precisaCobrir, cobrirRecusou: cobrirRecusou, cobrirSemProp: cobrirSemProp, cobriu: cobriu, desviadas: desviadas, encaixeFalhou: encaixeFalhou, escalas: escalas.join("/"), feitos: postas, foraDoLugar: foraDoLugar, forade: forade, ok: true, quadro: sw + "x" + sh, semEfeito: semEfeito, semEscala: semEscala, semTrilha: semTrilha, trilhaPedida: preferida >= 0 ? "V" + preferida + 1 : "", trilhas: listaTr.join(", "), trilhasCriadas: estadoTr.criadas};
if (clipesEscalados) { 
res.nota = clipesEscalados + " clipe(s) em escala diferente de 100% (" + escalas.join("/") + "%): a camada zooma o que est\xe1 embaixo, na escala que estiver.";
}
if (!postas) { 
res.warning = semTrilha ? estadoTr.falhouCriar ? "N\xe3o havia trilha livre acima dos clipes e o Premiere n\xe3o deixou criar uma. Crie uma trilha de v\xeddeo vazia acima e rode de novo." : "N\xe3o havia trilha livre acima dos clipes." : semEfeito ? "A camada de ajuste ENTROU, mas o efeito que anima (Transform) n\xe3o: " + (falhaEfeito) || ("motivo desconhecido") + ". Premiere " + _fsPrVersao() + " \u2014 me manda um print desta mensagem que eu adapto pra sua vers\xe3o." : "Nenhuma camada de ajuste entrou.";
}
else if (semEfeito) {
res.warning = semEfeito + " camada(s) entraram SEM o efeito que anima (Transform): " + (falhaEfeito) || ("motivo desconhecido") + ". Premiere " + _fsPrVersao() + ".";
}
else if (chavesNaoLidas) {
res.warning = chavesNaoLidas + " camada(s) entraram, mas as chaves do zoom N\xc3O voltaram na leitura (escrevi " + alvoPct + "%, li outra coisa). Premiere " + _fsPrVersao() + " - me manda um print desta mensagem.";
}
else if (abaixoDoClipe) {
res.warning = abaixoDoClipe + " camada(s) ficaram ABAIXO do clipe (V" + "): zoom invis\xedvel. Me manda um print desta mensagem.";
}
else if (semTrilha) {
res.warning = semTrilha + " clipe(s) ficaram sem zoom: n\xe3o havia trilha livre acima deles" + estadoTr.falhouCriar ? " e o Premiere n\xe3o deixou criar uma. Crie uma trilha de v\xeddeo vazia acima e rode de novo." : ".";
}
else if (ancoraSemProp) {
res.warning = ancoraSemProp + " camada(s) ficaram com o zoom no CENTRO: n\xe3o achei o ponto de " + "ancoragem dentro do Transform nesta vers\xe3o do Premiere (" + _fsPrVersao() + "). " + "me manda um print desta mensagem que eu adapto.";
}
else if (ancoraRecusada) {
res.warning = ancoraRecusada + " camada(s) ficaram com o zoom no CENTRO: o Premiere n\xe3o aceitou " + "o valor que escrevi no ponto de ancoragem (" + _fsPrVersao() + "). " + "desfiz pra n\xe3o deixar a camada fora da tela. me manda um print.";
}
else if (ancoraPulada) {
res.warning = ancoraPulada + " camada(s) ficaram com o zoom no CENTRO: n\xe3o reconheci o formato " + "do ponto de ancoragem nesta vers\xe3o do Premiere (" + _fsPrVersao() + "). " + "me manda um print desta mensagem que eu adapto.";
}
else if ((cobrirSemProp) || (cobrirRecusou)) {
res.warning = cobrirSemProp + cobrirRecusou + " camada(s) podem ter ficado MENORES que o quadro (zoom s\xf3 no meio): " + cobrirRecusou ? "o Premiere n\xe3o aceitou a Escala " + precisaCobrir + "% no Movimento da camada" : "n\xe3o achei a Escala no Movimento da camada" + " (" + _fsPrVersao() + "). Me manda um print desta mensagem.";
}
else if (foraDoLugar) {
res.warning = foraDoLugar + " camada(s) n\xe3o casaram com o tempo do clipe.";
}
else {
if (avisoTam) { 
res.warning = avisoTam;
}
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsSondaQe() {
try {
function nomes(obj) {
var lista = [];
try {
var ms = obj.reflect.methods;
for (var i = 0; i < ms.length; i += 1) { 
var n = "";
try {
n = String(ms[i].name);
} catch (eN) {continue ;
}
if ((n) && (n.charAt(0) !== "_")) { 
lista.push(n);
}}
} catch (e) {
}
lista.sort();
return lista;
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var ok = false;
try {
ok = !(!((qe) && (qe.project)));
} catch (eQ2) {ok = false;
}
if (!ok) { 
return _fsJSON.stringify({error: "QE indispon\xedvel. Reinicie o Premiere e tente de novo."});
}
var out = {candidatos: [], ok: true, projeto: [], sequencia: [], versao: ""};
try {
out.versao = String(app.version);
} catch (eV) {
}
out.projeto = nomes(qe.project);
try {
var qs = qe.project.getActiveSequence();
if (qs) { 
out.sequencia = nomes(qs);
}
} catch (eS) {
}
var alvo = ["adjust", "ajuste", "new", "create", "add", "transparent", "matte", "black", "synth"];
var todos = out.projeto.concat(out.sequencia);
for (var k = 0; k < todos.length; k += 1) { 
var low = todos[k].toLowerCase();
for (var a = 0; a < alvo.length; a += 1) { 
if (low.indexOf(alvo[a]) !== -1) { 
var jaTem = false;
for (var z = 0; z < out.candidatos.length; z += 1) { 
if (out.candidatos[z] === todos[k]) { 
jaTem = true;
}}
if (!jaTem) { 
out.candidatos.push(todos[k]);
}
break ;
}}}
out.candidatos.sort();
return _fsJSON.stringify(out);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsJLAnalisar(origemIdx, altIdx, escopo, primeiro, modo, dur, unidade) {
try {
function bateEmAlgo(s, e) {
for (var k = 0; k < ocupado.length; k += 1) { 
if ((s < (ocupado[k].e - half)) && (e > (ocupado[k].s + half))) { 
return true;
}}
return false;
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var TPS = _FS_AC_TPS;
var tpf = _fsAcTpf(seq);
var half = tpf / 2;
var trOrig = null;
var trAlt = null;
try {
trOrig = seq.audioTracks[origemIdx];
} catch (eO) {
}
try {
trAlt = seq.audioTracks[altIdx];
} catch (eA) {
}
if (!trOrig) { 
return _fsJSON.stringify({error: "A faixa de origem n\xe3o existe nesta sequ\xeancia."});
}
if (!trAlt) { 
return _fsJSON.stringify({error: "A faixa alternada n\xe3o existe nesta sequ\xeancia."});
}
var nomeAlt = "A" + altIdx + 1;
try {
if (trAlt.name) { 
nomeAlt = String(trAlt.name);
}
} catch (eNm) {
}
var passo = 0;
if (unidade === "ms") { 
passo = (parseFloat(dur) / 1000) * TPS;
}
else {
passo = parseFloat(dur) * tpf;
}
if ((isNaN(passo)) || (passo < 0)) { 
passo = 0;
}
var todos = [];
var i = 0;
for (var i = 0; i < trOrig.clips.numItems; i += 1) { 
var cl = null;
try {
cl = trOrig.clips[i];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = !(!cl.isSelected());
} catch (eS) {sel = false;
}
todos.push({clip: cl, idx: i, sel: sel});}
var usar = todos;
if (escopo === "sel") { 
var so = [];
for (var i = 0; i < todos.length; i += 1) { 
if (todos[i].sel) { 
so.push(todos[i]);
}}
if (so.length) { 
usar = so;
}
}
if (!usar.length) { 
return _fsJSON.stringify({clipes: 0, colisoes: 0, nomeAlt: nomeAlt, ok: true, semSobra: 0, sobraNaoMedida: 0, sobreposicaoFrames: Math.round(passo / tpf), vaoMover: 0});
}
var ocupado = [];
for (var i = 0; i < trAlt.clips.numItems; i += 1) { 
try {
var ac = trAlt.clips[i];
ocupado.push({e: parseFloat(ac.end.ticks), s: parseFloat(ac.start.ticks)});
} catch (eOc) {
}}
var vaiPrimeiro = primeiro === "alternada";
var vaoMover = 0;
var colisoes = 0;
var semSobra = 0;
var naoMedida = 0;
for (var i = 0; i < usar.length; i += 1) { 
var move = (i % 2) === 0 ? vaiPrimeiro : !vaiPrimeiro;
var c = usar[i].clip;
var cs = 0;
var ce = 0;
try {
cs = parseFloat(c.start.ticks);
ce = parseFloat(c.end.ticks);
} catch (eSE) {continue ;
}
if (move) { 
vaoMover++;
if (bateEmAlgo(cs, ce)) { 
colisoes++;
}
}
if ((modo !== "nenhum") && (passo > 0)) { 
if (modo === "j") { 
var inT = -1;
try {
inT = parseFloat(c.inPoint.ticks);
} catch (eIn) {inT = -1;
}
if (inT < 0) { 
naoMedida++;
}
else {
if (inT < passo) { 
semSobra++;
}
}
}
else {
var outT = -1;
var durMedia = -1;
try {
outT = parseFloat(c.outPoint.ticks);
} catch (eOu) {outT = -1;
}
try {
var pi = c.projectItem;
if ((pi) && (pi.getOutPoint)) { 
durMedia = parseFloat(pi.getOutPoint().ticks);
}
} catch (eDm) {durMedia = -1;
}
if ((outT < 0) || (durMedia <= 0)) { 
naoMedida++;
}
else {
if ((durMedia - outT) < passo) { 
semSobra++;
}
}
}
}}
return _fsJSON.stringify({clipes: usar.length, colisoes: colisoes, nomeAlt: nomeAlt, ok: true, semSobra: semSobra, sobraNaoMedida: naoMedida, sobreposicaoFrames: Math.round(passo / tpf), usouSelecao: (escopo === "sel") && (usar !== todos), vaoMover: vaoMover});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsJLNomes(obj) {
var props = [];
var mets = [];
try {
var rp = obj.reflect.properties;
for (var i = 0; i < rp.length; i += 1) { 
try {
props.push(String(rp[i].name));
} catch (e1) {
}}
} catch (eP) {
}
try {
var rm = obj.reflect.methods;
for (var j = 0; j < rm.length; j += 1) { 
try {
mets.push(String(rm[j].name));
} catch (e2) {
}}
} catch (eM) {
}
if ((!props.length) && (!mets.length)) { 
for (var k in obj) { 
try {
props.push(String(k));
} catch (e3) {
}
}
}
return {metodos: mets, propriedades: props};
}
function fsJLSonda() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Abra uma sequ\xeancia com um clipe de v\xeddeo que tenha \xe1udio."});
}
var rel = {};
rel.app = {build: String((app.build) || ("?")), versao: String((app.version) || ("?"))};
try {
rel.seq = {audio: seq.audioTracks.numTracks, nome: String(seq.name), video: seq.videoTracks.numTracks};
} catch (eS) {
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
try {
rel.qe = !(!(((qe) && (qe.project)) && (qe.project.getActiveSequence())));
} catch (eQ2) {rel.qe = false;
}
var alvo = null;
var alvoTr = -1;
for (var t = 0; (t < seq.audioTracks.numTracks) && (!alvo); t++) { 
var tr = null;
try {
tr = seq.audioTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
alvo = tr.clips[c];
alvoTr = t;
break ;
} catch (eC) {
}}}
if (!alvo) { 
return _fsJSON.stringify({error: "Nenhum clipe de \xe1udio na sequ\xeancia. Ponha um clipe com som e rode de novo."});
}
rel.clipeAudio = {trilha: "A" + alvoTr + 1};
try {
rel.clipeAudio.nome = String(alvo.name);
} catch (eN) {
}
try {
rel.clipeAudio.tipoMidia = String(alvo.mediaType);
} catch (eMt) {
}
try {
rel.clipeAudio.nodeId = String(alvo.nodeId);
} catch (eNi) {
}
rel.api = _fsJLNomes(alvo);
var pistas = [];
var todos = rel.api.propriedades.concat(rel.api.metodos);
for (var p = 0; p < todos.length; p += 1) { 
var n = todos[p].toLowerCase();
if (((((n.indexOf("link") >= 0) || (n.indexOf("track") >= 0)) || (n.indexOf("group") >= 0)) || (n.indexOf("move") >= 0)) || (n.indexOf("component") >= 0)) { 
pistas.push(todos[p]);
}}
rel.pistas = pistas;
rel.vinculo = {erro: "", quantos: -1, temGetLinkedItems: false};
try {
if (typeof alvo.getLinkedItems === "function") { 
rel.vinculo.temGetLinkedItems = true;
var li = alvo.getLinkedItems();
try {
rel.vinculo.quantos = li.numItems;
} catch (eL1) {try {
rel.vinculo.quantos = li.length;
} catch (eL2) {
}
}
}
} catch (eV) {rel.vinculo.erro = String(eV);
}
rel.projectItem = {};
try {
var pi = alvo.projectItem;
if (pi) { 
try {
rel.projectItem.nome = String(pi.name);
} catch (ePn) {
}
try {
rel.projectItem.temGetOutPoint = typeof pi.getOutPoint === "function";
} catch (ePo) {
}
try {
rel.projectItem.api = _fsJLNomes(pi).metodos;
} catch (ePa) {
}
}
} catch (ePi) {rel.projectItem.erro = String(ePi);
}
try {
var tr0 = seq.audioTracks[alvoTr];
rel.trilhaApi = _fsJLNomes(tr0).metodos;
} catch (eTa) {
}
try {
if (rel.qe) { 
var qs = qe.project.getActiveSequence();
var qt = qs.getAudioTrackAt(alvoTr);
rel.qeTrilhaApi = _fsJLNomes(qt).metodos;
try {
var qi = qt.getItemAt(0);
if (qi) { 
rel.qeItemApi = _fsJLNomes(qi).metodos;
}
} catch (eQi) {
}
}
} catch (eQt) {
}
rel.nota = "Sonda de leitura: nada foi alterado na timeline.";
return _fsJSON.stringify(rel);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsJLFaixaDe(kind, trackIdx, nodeId) {
try {
var seq = app.project.activeSequence;
var n = kind === "a" ? seq.audioTracks.numTracks : seq.videoTracks.numTracks;
for (var t = 0; t < n; t += 1) { 
var tr = kind === "a" ? seq.audioTracks[t] : seq.videoTracks[t];
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
if (String(tr.clips[c].nodeId) === String(nodeId)) { 
return t;
}
} catch (e1) {
}}}
} catch (e) {
}
return -1;
}
function _fsJLItemQE(qs, trackIdx, startTicks, half) {
try {
var qt = qs.getAudioTrackAt(trackIdx);
if (!qt) { 
return null;
}
var i = 0;
while (true) {
var it = null;
try {
it = qt.getItemAt(i);
} catch (eG) {break ;
}
if (!it) { 
break ;
}
var s = -1;
try {
s = parseFloat(it.start.ticks);
} catch (eS) {try {
s = parseFloat(it.start);
} catch (eS2) {s = -1;
}
}
if ((s >= 0) && (Math.abs(s - startTicks) <= half)) { 
return it;
}
i++;
if (i > 5000) { 
break ;
}
}
} catch (e) {
}
return null;
}
function _fsJLDescobrirMove(qs, origem, destino, clipe, half) {
var node = "";
try {
node = String(clipe.nodeId);
} catch (eN) {return 0;
}
var st = 0;
try {
st = parseFloat(clipe.start.ticks);
} catch (eSt) {return 0;
}
var variantes = [1, 2, 3, 4];
for (var v = 0; v < variantes.length; v += 1) { 
var num = variantes[v];
var it = _fsJLItemQE(qs, origem, st, half);
if (!it) { 
continue ;
}
var moveu = false;
try {
if (num === 1) { 
it.moveToTrack(destino);
}
else if (num === 2) {
it.moveToTrack(destino, 0);
}
else if (num === 3) {
it.moveToTrack(0, destino);
}
else {
it.moveToTrack(String(destino));
}
moveu = true;
} catch (eM) {moveu = false;
}
if (!moveu) { 
continue ;
}
var onde = _fsJLFaixaDe("a", destino, node);
if (onde === destino) { 
var volta = _fsJLItemQE(qs, destino, st, half);
if (volta) { 
try {
if (num === 1) { 
volta.moveToTrack(origem);
}
else if (num === 2) {
volta.moveToTrack(origem, 0);
}
else if (num === 3) {
volta.moveToTrack(0, origem);
}
else {
volta.moveToTrack(String(origem));
}
} catch (eV) {
}
}
if (_fsJLFaixaDe("a", origem, node) === origem) { 
return num;
}
return 0;
}}
return 0;
}
function _fsJLMover(qs, origem, destino, startTicks, variante, half) {
var it = _fsJLItemQE(qs, origem, startTicks, half);
if (!it) { 
return false;
}
try {
if (variante === 1) { 
it.moveToTrack(destino);
}
else if (variante === 2) {
it.moveToTrack(destino, 0);
}
else if (variante === 3) {
it.moveToTrack(0, destino);
}
else {
it.moveToTrack(String(destino));
}
} catch (e) {return false;
}
return true;
}
function fsJLAplicar(origemIdx, altIdx, escopo, primeiro, fazerBackup) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var tpf = _fsAcTpf(seq);
var half = tpf / 2;
var trOrig = null;
var trAlt = null;
try {
trOrig = seq.audioTracks[origemIdx];
} catch (eO) {
}
try {
trAlt = seq.audioTracks[altIdx];
} catch (eA) {
}
if (!trOrig) { 
return _fsJSON.stringify({error: "A faixa de origem n\xe3o existe."});
}
if (!trAlt) { 
return _fsJSON.stringify({error: "A faixa alternada n\xe3o existe."});
}
if (origemIdx === altIdx) { 
return _fsJSON.stringify({error: "As faixas t\xeam que ser diferentes."});
}
try {
if ((trOrig.isLocked()) || (trAlt.isLocked())) { 
return _fsJSON.stringify({error: "Destrave as duas faixas antes de intercalar."});
}
} catch (eL) {
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (eQ2) {qs = null;
}
if (!qs) { 
return _fsJSON.stringify({error: "N\xe3o consegui acessar o motor do Premiere (QE). Reinicie o Premiere \u2014 nada foi alterado."});
}
var todos = [];
for (var i = 0; i < trOrig.clips.numItems; i += 1) { 
var cl = null;
try {
cl = trOrig.clips[i];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = !(!cl.isSelected());
} catch (eS) {
}
var st = 0;
var en = 0;
var nd = "";
try {
st = parseFloat(cl.start.ticks);
en = parseFloat(cl.end.ticks);
nd = String(cl.nodeId);
} catch (eT) {continue ;
}
todos.push({end: en, node: nd, sel: sel, start: st});}
var usar = todos;
if (escopo === "sel") { 
var so = [];
for (var i = 0; i < todos.length; i += 1) { 
if (todos[i].sel) { 
so.push(todos[i]);
}}
if (so.length) { 
usar = so;
}
}
if (!usar.length) { 
return _fsJSON.stringify({error: "Nenhum clipe de \xe1udio no alcance escolhido."});
}
var vaiPrimeiro = primeiro === "alternada";
var mover = [];
for (var i = 0; i < usar.length; i += 1) { 
var move = (i % 2) === 0 ? vaiPrimeiro : !vaiPrimeiro;
if (move) { 
mover.push(usar[i]);
}}
if (!mover.length) { 
return _fsJSON.stringify({error: "Com estes ajustes nenhum clipe mudaria de faixa."});
}
var ocupado = [];
for (var i = 0; i < trAlt.clips.numItems; i += 1) { 
try {
var ac = trAlt.clips[i];
ocupado.push({e: parseFloat(ac.end.ticks), s: parseFloat(ac.start.ticks)});
} catch (eOc) {
}}
for (var i = 0; i < mover.length; i += 1) { 
for (var k = 0; k < ocupado.length; k += 1) { 
if ((mover[i].start < (ocupado[k].e - half)) && (mover[i].end > (ocupado[k].s + half))) { 
return _fsJSON.stringify({error: "A faixa de destino j\xe1 tem \xe1udio onde um dos clipes cairia. Escolha uma faixa vazia \u2014 nada foi alterado."});
}}}
var clipeTeste = null;
for (var i = 0; i < trOrig.clips.numItems; i += 1) { 
try {
if (String(trOrig.clips[i].nodeId) === String(mover[0].node)) { 
clipeTeste = trOrig.clips[i];
break ;
}
} catch (eF) {
}}
if (!clipeTeste) { 
return _fsJSON.stringify({error: "N\xe3o localizei o clipe de teste. Nada foi alterado."});
}
var variante = _fsJLDescobrirMove(qs, origemIdx, altIdx, clipeTeste, half);
if (!variante) { 
return _fsJSON.stringify({error: "Esta vers\xe3o do Premiere n\xe3o deixou mover o \xe1udio de faixa por script. Nada foi alterado na timeline.", needDiag: true});
}
var backupName = "";
var backupId = -1;
if (fazerBackup) { 
var origId = -1;
var origName = "";
try {
origId = seq.sequenceID;
} catch (eId) {
}
try {
origName = seq.name;
} catch (eNm) {
}
var vistos = {};
try {
for (var sb = 0; sb < app.project.sequences.numSequences; sb += 1) { 
try {
vistos[String(app.project.sequences[sb].sequenceID)] = 1;
} catch (eSb) {
}}
} catch (eEn) {
}
try {
seq.clone();
} catch (eCl) {
}
try {
for (var sc = 0; sc < app.project.sequences.numSequences; sc += 1) { 
var cs2 = app.project.sequences[sc];
var cid = "";
try {
cid = String(cs2.sequenceID);
} catch (eCid) {continue ;
}
if (!vistos[cid]) { 
backupId = cid;
var quer = origName ? origName : "Sequ\xeancia" + " \u2014 antes de intercalar";
try {
cs2.name = quer;
} catch (eRn) {
}
try {
if (cs2.projectItem) { 
cs2.projectItem.name = quer;
}
} catch (eRn2) {
}
try {
backupName = cs2.name;
} catch (eBn) {backupName = quer;
}
break ;
}}
} catch (eFi) {
}
try {
var act = app.project.activeSequence;
if (((act) && (origId !== -1)) && (act.sequenceID !== origId)) { 
for (var sq = 0; sq < app.project.sequences.numSequences; sq += 1) { 
var cand = app.project.sequences[sq];
if (cand.sequenceID === origId) { 
app.project.activeSequence = cand;
break ;
}}
}
} catch (eAt) {
}
try {
qs = qe.project.getActiveSequence();
} catch (eQ3) {
}
}
var movidos = 0;
var falhou = 0;
var semVinculo = 0;
for (i = mover.length - 1; i >= 0; i--) { 
var alvo = mover[i];
var ok = _fsJLMover(qs, origemIdx, altIdx, alvo.start, variante, half);
if (!ok) { 
falhou++;
continue ;
}
if (_fsJLFaixaDe("a", altIdx, alvo.node) === altIdx) { 
movidos++;
try {
var novo = null;
for (var z = 0; z < trAlt.clips.numItems; z += 1) { 
try {
if (String(trAlt.clips[z].nodeId) === String(alvo.node)) { 
novo = trAlt.clips[z];
break ;
}
} catch (eZ) {
}}
if ((novo) && (typeof novo.getLinkedItems === "function")) { 
var li = novo.getLinkedItems();
var q = 0;
try {
q = li.numItems;
} catch (eL1) {try {
q = li.length;
} catch (eL2) {q = 0;
}
}
if (q <= 1) { 
semVinculo++;
}
}
} catch (eVv) {
}
}
else {
falhou++;
}}
var res = {backup: backupName, backupId: backupId, falhou: falhou, movidos: movidos, ok: true, semVinculo: semVinculo, variante: variante};
if (falhou > 0) { 
res.warning = "Alguns clipes n\xe3o mudaram de faixa (" + falhou + "). Confira a timeline" + backupName ? " \u2014 a c\xf3pia de seguran\xe7a est\xe1 no projeto." : ".";
}
if (semVinculo > 0) { 
res.warning = res.warning ? res.warning + " " : "" + semVinculo + " clipe(s) parecem ter perdido o v\xednculo com o v\xeddeo.";
}
return _fsJSON.stringify(res);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsJLSonda2() {
try {
function nota(s) {
rel.passos.push(s);
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Abra a sequ\xeancia."});
}
var tpf = _fsAcTpf(seq);
var half = tpf / 2;
var rel = {passos: []};
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (eQ2) {
}
if (!qs) { 
return _fsJSON.stringify({error: "QE indispon\xedvel."});
}
nota("QE ok");
var origem = -1;
var alvo = null;
var alvoNode = "";
var alvoStart = 0;
for (var t = 0; (t < seq.audioTracks.numTracks) && (origem < 0); t++) { 
var tr = seq.audioTracks[t];
if (tr.clips.numItems > 0) { 
origem = t;
alvo = tr.clips[0];
try {
alvoNode = String(alvo.nodeId);
alvoStart = parseFloat(alvo.start.ticks);
} catch (eA) {
}
}}
if (origem < 0) { 
return _fsJSON.stringify({error: "Nenhum clipe de \xe1udio na sequ\xeancia."});
}
var destino = -1;
for (var d = 0; d < seq.audioTracks.numTracks; d += 1) { 
if ((d !== origem) && (seq.audioTracks[d].clips.numItems === 0)) { 
destino = d;
break ;
}}
if (destino < 0) { 
return _fsJSON.stringify({error: "Preciso de uma faixa de \xe1udio VAZIA pra testar. Crie uma e rode de novo."});
}
rel.faixas = {destino: "A" + destino + 1, origem: "A" + origem + 1};
rel.clipe = {node: alvoNode, startTicks: alvoStart};
nota("clipe de teste: A" + origem + 1 + ", node " + alvoNode);
var qt = null;
try {
qt = qs.getAudioTrackAt(origem);
} catch (eT) {
}
rel.qeTrilhaObtida = !(!qt);
if (!qt) { 
return _fsJSON.stringify(rel);
}
var itens = [];
for (var i = 0; i < 50; i += 1) { 
var it = null;
try {
it = qt.getItemAt(i);
} catch (eI) {break ;
}
if (!it) { 
break ;
}
var info = {indice: i};
try {
info.startTipo = typeof it.start;
} catch (e1) {
}
try {
info.startBruto = String(it.start);
} catch (e2) {info.startBruto = "(nao leu)";
}
try {
info.startTicks = String(it.start.ticks);
} catch (e3) {info.startTicks = "(sem .ticks)";
}
try {
info.startSecs = String(it.start.secs);
} catch (e3b) {info.startSecs = "(sem .secs)";
}
try {
info.nome = String(it.name);
} catch (e4) {
}
try {
info.tipo = String(it.type);
} catch (e5) {
}
itens.push(info);}
rel.itensDoQE = itens;
rel.quantosItens = itens.length;
nota("QE devolveu " + itens.length + " item(ns) na faixa de origem");
if (!itens.length) { 
nota("PARou aqui: sem item do QE nao ha o que mover");
return _fsJSON.stringify(rel);
}
try {
var it0 = qt.getItemAt(0);
var props = {};
var nm = _fsJLNomes(it0);
rel.qeItemPropriedades = nm.propriedades;
for (var p = 0; p < nm.propriedades.length; p += 1) { 
var k = nm.propriedades[p];
try {
props[k] = String(it0[k]).substring(0, 60);
} catch (eP) {props[k] = "(nao leu)";
}}
rel.qeItemValores = props;
} catch (eV) {
}
var tentativas = [];
var qtDest = null;
try {
qtDest = qs.getAudioTrackAt(destino);
} catch (eD) {
}
for (var v = 1; v <= 6; v += 1) { 
var reg = {chamou: false, erro: "", faixaDepois: -1, variante: v, voltou: null};
var item = null;
try {
item = qs.getAudioTrackAt(origem).getItemAt(0);
} catch (eR) {
}
if (!item) { 
reg.erro = "nao achei o item no QE";
tentativas.push(reg);
continue ;
}
try {
if (v === 1) { 
item.moveToTrack(destino);
}
else if (v === 2) {
item.moveToTrack(destino, 0);
}
else if (v === 3) {
item.moveToTrack(0, destino);
}
else if (v === 4) {
item.moveToTrack(String(destino));
}
else if (v === 5) {
item.moveToTrack(qtDest);
}
else {
item.moveToTrack(qtDest, 0);
}
reg.chamou = true;
} catch (eC) {reg.erro = String(eC);
}
reg.faixaDepois = _fsJLFaixaDe("a", destino, alvoNode);
if (reg.faixaDepois === destino) { 
reg.resultado = "MOVEU";
var volta = null;
try {
volta = qs.getAudioTrackAt(destino).getItemAt(0);
} catch (eB) {
}
if (volta) { 
try {
if (v === 1) { 
volta.moveToTrack(origem);
}
else if (v === 2) {
volta.moveToTrack(origem, 0);
}
else if (v === 3) {
volta.moveToTrack(0, origem);
}
else if (v === 4) {
volta.moveToTrack(String(origem));
}
else if (v === 5) {
volta.moveToTrack(qs.getAudioTrackAt(origem));
}
else {
volta.moveToTrack(qs.getAudioTrackAt(origem), 0);
}
} catch (eBk) {reg.erroVolta = String(eBk);
}
}
reg.voltou = _fsJLFaixaDe("a", origem, alvoNode) === origem;
tentativas.push(reg);
break ;
}
else {
reg.resultado = reg.chamou ? "chamou mas nao moveu" : "nem chamou";
tentativas.push(reg);
}}
rel.tentativas = tentativas;
var ondeFicou = -1;
for (var z = 0; z < seq.audioTracks.numTracks; z += 1) { 
if (_fsJLFaixaDe("a", z, alvoNode) === z) { 
ondeFicou = z;
break ;
}}
rel.clipeTerminouNaFaixa = ondeFicou >= 0 ? "A" + ondeFicou + 1 : "NAO ENCONTRADO";
rel.voltouPraOrigem = ondeFicou === origem;
if (!rel.voltouPraOrigem) { 
rel.AVISO = "O clipe de teste NAO voltou pra faixa original. Desfa\xe7a com Ctrl+Z.";
}
return _fsJSON.stringify(rel);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsJLSonda3() {
var idClone = -1;
var idOrig = -1;
try {
function item() {
try {
return qs.getAudioTrackAt(origem).getItemAt(0);
} catch (e) {return null;
}
}
function chamar(it, args) {
try {
if (args.length === 1) { 
it.moveToTrack(args[0]);
}
else if (args.length === 2) {
it.moveToTrack(args[0], args[1]);
}
else if (args.length === 3) {
it.moveToTrack(args[0], args[1], args[2]);
}
else if (args.length === 4) {
it.moveToTrack(args[0], args[1], args[2], args[3]);
}
else if (args.length === 5) {
it.moveToTrack(args[0], args[1], args[2], args[3], args[4]);
}
else {
it.moveToTrack(args[0], args[1], args[2], args[3], args[4], args[5]);
}
return "";
} catch (e) {return String(e);
}
}
var proj = app.project;
var orig = proj.activeSequence;
if (!orig) { 
return _fsJSON.stringify({error: "Abra a sequ\xeancia."});
}
try {
idOrig = orig.sequenceID;
} catch (eIo) {
}
var rel = {nota: "Tudo rodou numa c\xf3pia descart\xe1vel. A sua sequ\xeancia n\xe3o foi tocada."};
var vistos = {};
for (var s = 0; s < proj.sequences.numSequences; s += 1) { 
try {
vistos[String(proj.sequences[s].sequenceID)] = 1;
} catch (eS) {
}}
try {
orig.clone();
} catch (eCl) {return _fsJSON.stringify({error: "N\xe3o consegui duplicar a sequ\xeancia pra testar."});
}
var clone = null;
for (var c = 0; c < proj.sequences.numSequences; c += 1) { 
var cs = proj.sequences[c];
var cid = "";
try {
cid = String(cs.sequenceID);
} catch (eC) {continue ;
}
if (!vistos[cid]) { 
clone = cs;
idClone = cid;
break ;
}}
if (!clone) { 
return _fsJSON.stringify({error: "N\xe3o achei a c\xf3pia rec\xe9m-criada."});
}
try {
clone.name = "TESTE FRAME SPEED (pode apagar)";
} catch (eN) {
}
try {
proj.openSequence(String(idClone));
} catch (eO) {
}
try {
proj.activeSequence = clone;
} catch (eA) {
}
rel.clone = "criada e ativada";
var seq = app.project.activeSequence;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (eQ2) {
}
if (!qs) { 
_fsAcDeleteSeq(idClone, idOrig);
return _fsJSON.stringify({error: "QE indispon\xedvel."});
}
var origem = -1;
var destino = -1;
var node = "";
var startT = 0;
for (var t = 0; t < seq.audioTracks.numTracks; t += 1) { 
if ((origem < 0) && (seq.audioTracks[t].clips.numItems > 0)) { 
origem = t;
try {
node = String(seq.audioTracks[t].clips[0].nodeId);
startT = parseFloat(seq.audioTracks[t].clips[0].start.ticks);
} catch (eF) {
}
}}
for (var d = 0; d < seq.audioTracks.numTracks; d += 1) { 
if ((d !== origem) && (seq.audioTracks[d].clips.numItems === 0)) { 
destino = d;
break ;
}}
if ((origem < 0) || (destino < 0)) { 
_fsAcDeleteSeq(idClone, idOrig);
try {
proj.activeSequence = orig;
} catch (eR) {
}
return _fsJSON.stringify({error: "Preciso de uma faixa com clipe e outra VAZIA. Crie uma faixa de \xe1udio vazia e rode de novo."});
}
rel.faixas = {destino: destino, origem: origem};
var aridade = 0;
var faseA = [];
for (var n = 1; n <= 6; n += 1) { 
var zeros = [];
for (var z = 0; z < n; z += 1) { 
zeros.push(0);}
var it = item();
if (!it) { 
faseA.push({args: n, erro: "sem item"});
continue ;
}
var err = chamar(it, zeros);
var reg = {args: n, erro: (err) || ("(sem erro)")};
reg.faixaDoClipe = _fsJLFaixaDe("a", destino, node);
faseA.push(reg);
if (err.indexOf("Not Enough Parameters") < 0) { 
aridade = n;
break ;
}}
rel.faseA_aridade = faseA;
rel.aridadeDescoberta = aridade;
var faseB = [];
if (aridade >= 1) { 
for (var pos = 0; pos < aridade; pos += 1) { 
var it2 = item();
if (!it2) { 
faseB.push({erro: "clipe nao esta mais na origem", posicao: pos});
break ;
}
var args = [];
for (var k = 0; k < aridade; k += 1) { 
args.push(k === pos ? destino : 0);}
var e2 = chamar(it2, args);
var onde = -1;
for (var f = 0; f < seq.audioTracks.numTracks; f += 1) { 
if (_fsJLFaixaDe("a", f, node) === f) { 
onde = f;
break ;
}}
faseB.push({acertou: onde === destino, args: args.join(","), clipeFoiPara: onde, erro: (e2) || ("(sem erro)"), posicao: pos});
if (onde === destino) { 
rel.POSICAO_DA_FAIXA = pos;
break ;
}}
}
rel.faseB_posicao = faseB;
try {
proj.activeSequence = orig;
} catch (eV) {
}
_fsAcDeleteSeq(idClone, idOrig);
rel.cloneApagada = true;
return _fsJSON.stringify(rel);
} catch (e) {try {
_fsAcDeleteSeq(idClone, idOrig);
} catch (eD) {
}
return _fsJSON.stringify({cloneApagada: "tentei", error: e.toString()});
}
}
function fsAutocutSondaLink() {
var idClone = -1;
var idOrig = -1;
try {
function linksDe(cl) {
try {
var li = cl.getLinkedItems();
try {
return li.numItems;
} catch (eL1) {return li.length;
}
} catch (eL2) {return -1;
}
}
function soLink(obj) {
var out = [];
try {
var nm = _fsJLNomes(obj);
var todos = (nm.propriedades) || ([]).concat((nm.metodos) || ([]));
for (var q = 0; q < todos.length; q += 1) { 
if (/link/i.test(todos[q])) { 
out.push(todos[q]);
}}
} catch (eN2) {
}
return out;
}
var proj = app.project;
var orig = proj.activeSequence;
if (!orig) { 
return _fsJSON.stringify({error: "Abra a sequ\xeancia."});
}
try {
idOrig = orig.sequenceID;
} catch (eIo) {
}
var rel = {nota: "Rodou numa C\xd3PIA descart\xe1vel; a sua sequ\xeancia n\xe3o foi tocada."};
var vistos = {};
for (var s = 0; s < proj.sequences.numSequences; s += 1) { 
try {
vistos[String(proj.sequences[s].sequenceID)] = 1;
} catch (eS) {
}}
try {
orig.clone();
} catch (eCl) {return _fsJSON.stringify({error: "N\xe3o consegui duplicar a sequ\xeancia."});
}
var clone = null;
for (var c = 0; c < proj.sequences.numSequences; c += 1) { 
var cs = proj.sequences[c];
var cid = "";
try {
cid = String(cs.sequenceID);
} catch (eC) {continue ;
}
if (!vistos[cid]) { 
clone = cs;
idClone = cid;
break ;
}}
if (!clone) { 
return _fsJSON.stringify({error: "N\xe3o achei a c\xf3pia rec\xe9m-criada."});
}
try {
clone.name = "TESTE FRAME SPEED (pode apagar)";
} catch (eN) {
}
try {
proj.openSequence(String(idClone));
} catch (eO) {
}
try {
proj.activeSequence = clone;
} catch (eA) {
}
var seq = app.project.activeSequence;
var tpf = _fsAcTpf(seq);
var disp = _fsAcDisplayFormat(seq);
var half = tpf / 2;
var vIdx = -1;
var vClip = null;
for (var v = 0; (v < seq.videoTracks.numTracks) && (!vClip); v++) { 
var tr = seq.videoTracks[v];
for (var i = 0; i < tr.clips.numItems; i += 1) { 
try {
if (linksDe(tr.clips[i]) >= 2) { 
vClip = tr.clips[i];
vIdx = v;
break ;
}
} catch (eF) {
}}}
rel.antesDoRazor = {achouParVinculado: !(!vClip), links: vClip ? linksDe(vClip) : -1};
if (!vClip) { 
try {
proj.activeSequence = orig;
} catch (eR) {
}
_fsAcDeleteSeq(idClone, idOrig);
rel.error = "Nenhum clipe de v\xeddeo com \xe1udio VINCULADO na sequ\xeancia \u2014 o teste precisa de um.";
return _fsJSON.stringify(rel);
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (eQ2) {
}
if (!qs) { 
try {
proj.activeSequence = orig;
} catch (eR2) {
}
_fsAcDeleteSeq(idClone, idOrig);
return _fsJSON.stringify({error: "QE indispon\xedvel."});
}
var meio = (parseFloat(vClip.start.ticks) + parseFloat(vClip.end.ticks)) / 2;
meio = Math.round(meio / tpf) * tpf;
var tc = _fsAcTicksToTC(meio, tpf, disp);
var razors = 0;
for (var v2 = 0; v2 < seq.videoTracks.numTracks; v2 += 1) { 
try {
qs.getVideoTrackAt(v2).razor(tc);
razors++;
} catch (eV) {
}}
for (var a2 = 0; a2 < seq.audioTracks.numTracks; a2 += 1) { 
try {
qs.getAudioTrackAt(a2).razor(tc);
razors++;
} catch (eA2) {
}}
rel.razors = razors;
var metades = [];
try {
var trV = seq.videoTracks[vIdx];
for (var m = 0; (m < trV.clips.numItems) && (m < 6); m++) { 
metades.push({inicioSeg: parseFloat(trV.clips[m].start.seconds).toFixed(2), links: linksDe(trV.clips[m])});}
} catch (eM) {
}
rel.depoisDoRazor = metades;
rel.linkNaSequenciaDOM = soLink(seq);
rel.linkNoQESeq = soLink(qs);
try {
var qi = qs.getVideoTrackAt(vIdx).getItemAt(0);
if (qi) { 
rel.linkNoQEItem = soLink(qi);
}
} catch (eQi) {
}
rel.testeLinkSelection = "linkSelection n\xe3o existe na sequ\xeancia";
try {
if (typeof seq.linkSelection === "function") { 
var alvoV = seq.videoTracks[vIdx].clips[0];
try {
alvoV.setSelected(true, true);
} catch (eSel) {try {
alvoV.setSelected(true);
} catch (eSel1) {
}
}
var s0 = parseFloat(alvoV.start.ticks);
var e0 = parseFloat(alvoV.end.ticks);
var achouAudio = 0;
for (var a3 = 0; a3 < seq.audioTracks.numTracks; a3 += 1) { 
var trA = seq.audioTracks[a3];
for (var i3 = 0; i3 < trA.clips.numItems; i3 += 1) { 
var cA = trA.clips[i3];
var sA = parseFloat(cA.start.ticks);
var eA2 = parseFloat(cA.end.ticks);
if ((Math.abs(sA - s0) <= half) && (Math.abs(eA2 - e0) <= half)) { 
try {
cA.setSelected(true, false);
achouAudio++;
} catch (eSel2) {try {
cA.setSelected(true);
achouAudio++;
} catch (eSel3) {
}
}
}}}
var ret = seq.linkSelection();
rel.testeLinkSelection = {audiosSelecionados: achouAudio, linksDepoisDeReligar: linksDe(seq.videoTracks[vIdx].clips[0]), retorno: String(ret)};
}
} catch (eLk) {rel.testeLinkSelection = {erro: String(eLk)};
}
try {
proj.activeSequence = orig;
} catch (eV3) {
}
_fsAcDeleteSeq(idClone, idOrig);
rel.cloneApagada = true;
return _fsJSON.stringify(rel);
} catch (e) {try {
_fsAcDeleteSeq(idClone, idOrig);
} catch (eD) {
}
return _fsJSON.stringify({error: e.toString()});
}
}
function fsAudioNoTrecho(trilhaIdx, iniSeg, fimSeg) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var ini = parseFloat(iniSeg);
var fim = parseFloat(fimSeg);
if ((isNaN(ini)) || (ini < 0)) { 
ini = 0;
}
if ((isNaN(fim)) || (!(fim > ini))) { 
fim = 1000000000000;
}
var idx = parseInt(trilhaIdx, 10);
if (isNaN(idx)) { 
idx = -1;
}
var n = 0;
var total = 0;
try {
n = seq.audioTracks.numTracks;
} catch (eN) {n = 0;
}
for (var t = 0; t < n; t += 1) { 
if ((idx >= 0) && (t !== idx)) { 
continue ;
}
var tr = null;
try {
tr = seq.audioTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
var cl = tr.clips[c];
var cs = parseFloat(cl.start.seconds);
var ce = parseFloat(cl.end.seconds);
if ((cs < fim) && (ce > ini)) { 
total++;
}
} catch (eC) {
}}}
return _fsJSON.stringify({clipes: total, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsRegioesDeAudio(trilhaIdx) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var idx = parseInt(trilhaIdx, 10);
if (isNaN(idx)) { 
idx = -1;
}
var iv = [];
var n = 0;
try {
n = seq.audioTracks.numTracks;
} catch (eN) {n = 0;
}
var mudas = [];
var comAudio = 0;
var alvoMudo = false;
var temSolo = false;
var soloSabido = false;
for (var t = 0; t < n; t += 1) { 
if ((idx >= 0) && (t !== idx)) { 
continue ;
}
var tr = null;
try {
tr = seq.audioTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var nClipes = 0;
try {
nClipes = tr.clips.numItems;
} catch (eNc) {nClipes = 0;
}
var mudo = false;
try {
mudo = typeof tr.isMuted === "function" ? !(!tr.isMuted()) : false;
} catch (eM) {mudo = false;
}
try {
if (typeof tr.isSoloed === "function") { 
soloSabido = true;
if (tr.isSoloed()) { 
temSolo = true;
}
}
} catch (eS) {
}
if (nClipes > 0) { 
comAudio++;
if (mudo) { 
mudas.push("A" + t + 1);
}
}
if (mudo) { 
alvoMudo = true;
}
for (var c = 0; c < nClipes; c += 1) { 
try {
iv.push({e: parseFloat(tr.clips[c].end.seconds), s: parseFloat(tr.clips[c].start.seconds)});
} catch (eC) {
}}}
if (idx < 0) { 
alvoMudo = (comAudio > 0) && (mudas.length === comAudio);
}
for (var a = 1; a < iv.length; a += 1) { 
var v = iv[a];
var b = a - 1;
while ((b >= 0) && (iv[b].s > v.s)) {
iv[b + 1] = iv[b];
b--;
}
iv[b + 1] = v;}
var out = [];
for (var i = 0; i < iv.length; i += 1) { 
if ((out.length) && (iv[i].s <= (out[out.length - 1].e + 0.05))) { 
if (iv[i].e > out[out.length - 1].e) { 
out[out.length - 1].e = iv[i].e;
}
}
else {
out.push({e: iv[i].e, s: iv[i].s});
}}
var resp = {alvoMudo: alvoMudo, clipes: iv.length, comAudio: comAudio, mudas: mudas, ok: true, regioes: out};
if (soloSabido) { 
resp.temSolo = temSolo;
}
return _fsJSON.stringify(resp);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsAnimComp(clip, nomes) {
var cps = null;
try {
cps = clip.components;
} catch (e) {
}
var n = 0;
try {
n = cps ? cps.numItems : 0;
} catch (e2) {
}
for (var i = 0; i < n; i += 1) { 
var c = null;
try {
c = cps[i];
} catch (e3) {continue ;
}
if (!c) { 
continue ;
}
var dn = "";
try {
dn = ("" + (c.displayName) || ("")).toLowerCase();
} catch (e4) {
}
for (var j = 0; j < nomes.length; j += 1) { 
if (dn.indexOf(nomes[j]) !== -1) { 
return c;
}}}
return null;
}
function _fsAnimProps(mo) {
var out = {esc: null, pos: null};
var pps = null;
try {
pps = mo.properties;
} catch (e) {
}
var n = 0;
try {
n = pps ? pps.numItems : 0;
} catch (e2) {
}
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = pps[i];
} catch (e3) {continue ;
}
if (!p) { 
continue ;
}
var pn = "";
try {
pn = ("" + (p.displayName) || ("")).toLowerCase();
} catch (e4) {
}
var ehEsc = ((((((pn.indexOf("scale") === 0) || (pn.indexOf("escala") === 0)) && (pn.indexOf("width") === -1)) && (pn.indexOf("largura") === -1)) && (pn.indexOf("ancho") === -1)) && (pn.indexOf("uniform") === -1)) && (pn.indexOf("uniforme") === -1);
var ehPos = pn.indexOf("posi") === 0;
if ((!ehEsc) && (!ehPos)) { 
if (i === 0) { 
ehPos = true;
}
else {
if (i === 1) { 
ehEsc = true;
}
}
}
if ((ehPos) && (!out.pos)) { 
out.pos = p;
}
if ((ehEsc) && (!out.esc)) { 
out.esc = p;
}}
return out;
}
function _fsAnimBase(prop) {
if (!prop) { 
return null;
}
var base = null;
var tv = false;
try {
tv = (typeof prop.isTimeVarying === "function") && (prop.isTimeVarying());
} catch (e) {
}
if (tv) { 
var ks = null;
try {
ks = prop.getKeys();
} catch (e2) {
}
if ((ks) && (ks.length)) { 
try {
base = prop.getValueAtKey(ks[ks.length - 1]);
} catch (e3) {
}
}
try {
prop.setTimeVarying(false);
} catch (e4) {
}
}
if ((base === null) || (base === undefined)) { 
try {
base = prop.getValue();
} catch (e5) {
}
}
if (((base !== null) && (base !== undefined)) && (tv)) { 
try {
prop.setValue(base, true);
} catch (e6) {
}
}
return base === undefined ? null : base;
}
function _fsAnimChaves(prop, valores, t0) {
try {
if (typeof prop.setTimeVarying === "function") { 
prop.setTimeVarying(true);
}
} catch (e) {return 0;
}
var n = 0;
for (var i = 0; i < valores.length; i += 1) { 
var t = t0 + valores[i].t;
try {
prop.addKey(t);
prop.setValueAtKey(t, valores[i].v, true);
n++;
} catch (e2) {
}}
return n;
}
function fsAnimTexto(cfg) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "semSequencia"});
}
if (!cfg) { 
return _fsJSON.stringify({error: "receitaVazia"});
}
var canais = (cfg.canais) || ({});
var sel = null;
try {
sel = seq.getSelection();
} catch (eS) {
}
if ((!sel) || (!sel.length)) { 
return _fsJSON.stringify({error: "semSelecao"});
}
var feitos = 0;
var chaves = 0;
var pulados = 0;
var semBase = 0;
for (var i = 0; i < sel.length; i += 1) { 
var clip = sel[i];
if (!clip) { 
continue ;
}
var ehVideo = false;
try {
ehVideo = ("" + clip.mediaType).toLowerCase().indexOf("video") !== -1;
} catch (eM) {
}
if (!ehVideo) { 
try {
ehVideo = !(!((clip.components) && (clip.components.numItems)));
} catch (eM2) {
}
}
if (!ehVideo) { 
pulados++;
continue ;
}
var mo = _fsAnimComp(clip, ["motion", "movimento", "movimiento"]);
var op = _fsAnimComp(clip, ["opacity", "opacidade", "opacidad"]);
var mp = mo ? _fsAnimProps(mo) : {esc: null, pos: null};
var opProp = null;
if (op) { 
try {
opProp = op.properties[0];
} catch (eO) {
}
}
var t0 = 0;
try {
t0 = clip.inPoint.seconds;
} catch (eT) {
}
var escBase = _fsAnimBase(mp.esc);
var posBase = _fsAnimBase(mp.pos);
var opBase = _fsAnimBase(opProp);
if (opBase === null) { 
opBase = 100;
}
var mexeu = false;
if ((((canais.escala) && (canais.escala.length)) && (mp.esc)) && (typeof escBase === "number")) { 
var vE = [];
for (var k = 0; k < canais.escala.length; k += 1) { 
vE.push({t: canais.escala[k].t, v: escBase * canais.escala[k].f});}
chaves += _fsAnimChaves(mp.esc, vE, t0);
mexeu = true;
}
if (((((canais.pos) && (canais.pos.length)) && (mp.pos)) && (posBase)) && (posBase.length === 2)) { 
var vP = [];
for (var k2 = 0; k2 < canais.pos.length; k2 += 1) { 
vP.push({t: canais.pos[k2].t, v: [posBase[0] + canais.pos[k2].dx, posBase[1] + canais.pos[k2].dy]});}
chaves += _fsAnimChaves(mp.pos, vP, t0);
mexeu = true;
}
if (((canais.opac) && (canais.opac.length)) && (opProp)) { 
var vO = [];
for (var k3 = 0; k3 < canais.opac.length; k3 += 1) { 
vO.push({t: canais.opac[k3].t, v: (canais.opac[k3].v / 100) * opBase});}
chaves += _fsAnimChaves(opProp, vO, t0);
mexeu = true;
}
var temReceita = !(!((((canais.escala) && (canais.escala.length)) || ((canais.pos) && (canais.pos.length))) || ((canais.opac) && (canais.opac.length))));
if ((temReceita) && (!mexeu)) { 
semBase++;
continue ;
}
feitos++;}
return _fsJSON.stringify({chaves: chaves, clipes: feitos, ok: true, pulados: pulados, semBase: semBase});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsRaioXTimeline() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var TPS = 254016000000;
var fim = 0;
try {
fim = parseFloat(seq.end) / TPS;
} catch (eE) {
}
var rel = {camadas: [], cortes: [], duracao: fim, guias: [], legendas: [], ok: true, sequencia: String((seq.name) || ("")), trilhasA: [], trilhasV: []};
try {
rel.largura = (parseInt(seq.frameSizeHorizontal, 10)) || (0);
rel.altura = (parseInt(seq.frameSizeVertical, 10)) || (0);
} catch (eF) {
}
var nv = 0;
try {
nv = seq.videoTracks.numTracks;
} catch (eN) {nv = 0;
}
for (var t = 0; t < nv; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var nc = 0;
try {
nc = tr.clips.numItems;
} catch (eC) {nc = 0;
}
var info = {clipes: nc, nomes: [], segundos: 0, travada: false, trilha: "V" + t + 1};
try {
info.travada = !(!((tr.isLocked) && (tr.isLocked())));
} catch (eL) {
}
var pedacos = [];
for (var c = 0; c < nc; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eCl) {continue ;
}
if (!cl) { 
continue ;
}
var s = 0;
var e = 0;
var nome = "";
try {
s = parseFloat(cl.start.seconds);
e = parseFloat(cl.end.seconds);
} catch (eS) {continue ;
}
try {
nome = String((cl.name) || (""));
} catch (eNm) {
}
info.segundos += (e - s);
pedacos.push({e: e, nome: nome, s: s});
if (nome.indexOf(FS_GUIA_MARCA) >= 0) { 
rel.guias.push({fim: e, ini: s, nome: nome, trilha: info.trilha});
}}
var emendas = 0;
var buracos = [];
for (var q = 1; q < pedacos.length; q += 1) { 
var d = pedacos[q].s - pedacos[q - 1].e;
if (d < 0.02) { 
emendas++;
}
else {
buracos.push({dur: d, ini: pedacos[q - 1].e});
}}
info.emendas = emendas;
info.buracos = buracos.length;
info.buracoMaior = 0;
for (var b = 0; b < buracos.length; b += 1) { 
if (buracos[b].dur > info.buracoMaior) { 
info.buracoMaior = buracos[b].dur;
}}
if ((t === 0) && (pedacos.length)) { 
for (var pz = 0; pz < pedacos.length; pz += 1) { 
rel.cortes.push({dur: pedacos[pz].e - pedacos[pz].s, ini: pedacos[pz].s});}
}
rel.trilhasV.push(info);}
var na = 0;
try {
na = seq.audioTracks.numTracks;
} catch (eNa) {na = 0;
}
for (var a2 = 0; a2 < na; a2 += 1) { 
var ta = null;
try {
ta = seq.audioTracks[a2];
} catch (eTa) {continue ;
}
if (!ta) { 
continue ;
}
var nca = 0;
var seg = 0;
var nomeT = "";
try {
nca = ta.clips.numItems;
} catch (eCa) {nca = 0;
}
try {
nomeT = String((ta.name) || (""));
} catch (eNt) {
}
for (var ca = 0; ca < nca; ca += 1) { 
try {
seg += (parseFloat(ta.clips[ca].end.seconds) - parseFloat(ta.clips[ca].start.seconds));
} catch (eSa) {
}}
rel.trilhasA.push({clipes: nca, nome: nomeT, segundos: seg, trilha: "A" + a2 + 1});}
for (var tv = 0; tv < nv; tv += 1) { 
var trv = null;
try {
trv = seq.videoTracks[tv];
} catch (eTv) {continue ;
}
if (!trv) { 
continue ;
}
var ncv = 0;
try {
ncv = trv.clips.numItems;
} catch (eCv) {ncv = 0;
}
for (var cv = 0; cv < ncv; cv += 1) { 
var clv = null;
try {
clv = trv.clips[cv];
} catch (eClv) {continue ;
}
if (!clv) { 
continue ;
}
var mg = null;
try {
mg = clv.getMGTComponent();
} catch (eMg) {mg = null;
}
if (!mg) { 
continue ;
}
var ls = 0;
var le = 0;
try {
ls = parseFloat(clv.start.seconds);
le = parseFloat(clv.end.seconds);
} catch (eLs) {continue ;
}
rel.legendas.push({dur: le - ls, fim: le, ini: ls, trilha: "V" + tv + 1});}}
var orfas = 0;
for (var lg = 0; lg < rel.legendas.length; lg += 1) { 
var L = rel.legendas[lg];
var meio = (L.ini + L.fim) / 2;
var temBase = false;
for (var tb = 0; (tb < nv) && (!temBase); tb++) { 
var trb = null;
try {
trb = seq.videoTracks[tb];
} catch (eTb) {continue ;
}
if (!trb) { 
continue ;
}
var ncb = 0;
try {
ncb = trb.clips.numItems;
} catch (eCb) {ncb = 0;
}
for (var cb = 0; cb < ncb; cb += 1) { 
var clb = null;
try {
clb = trb.clips[cb];
} catch (eClb) {continue ;
}
if (!clb) { 
continue ;
}
var mgb = null;
try {
mgb = clb.getMGTComponent();
} catch (eMgb) {mgb = null;
}
if (mgb) { 
continue ;
}
var bs = 0;
var be = 0;
var bn = "";
try {
bs = parseFloat(clb.start.seconds);
be = parseFloat(clb.end.seconds);
} catch (eBs) {continue ;
}
try {
bn = String((clb.name) || (""));
} catch (eBn) {
}
if (bn.indexOf(FS_GUIA_MARCA) >= 0) { 
continue ;
}
if ((bs <= meio) && (be >= meio)) { 
temBase = true;
break ;
}}}
if (!temBase) { 
orfas++;
L.orfa = 1;
}}
rel.legendasOrfas = orfas;
return _fsJSON.stringify(rel);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsFrameDaSequencia() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var TPS = 254016000000;
var tpf = 0;
try {
tpf = parseFloat(seq.timebase);
} catch (eT) {
}
if ((!tpf) || (tpf <= 0)) { 
return _fsJSON.stringify({error: "N\xe3o consegui ler o timebase da sequ\xeancia."});
}
return _fsJSON.stringify({fps: TPS / tpf, ok: true, tpf: tpf, tpfSeg: tpf / TPS});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsRelatorioAutoEdit() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var rel = {cortes: [], duracao: 0, ok: true, sequencia: String((seq.name) || ("")), sfx: [], transicoes: [], trilhaSfx: "", zooms: []};
try {
rel.duracao = parseFloat(seq.end) / 254016000000;
} catch (eD) {
}
try {
rel.largura = (parseInt(seq.frameSizeHorizontal, 10)) || (0);
rel.altura = (parseInt(seq.frameSizeVertical, 10)) || (0);
} catch (eF) {
}
try {
var tpfR = 0;
try {
tpfR = parseFloat(seq.timebase);
} catch (eTb) {
}
rel.timebaseLido = !(!((tpfR) && (tpfR > 0)));
if (!rel.timebaseLido) { 
tpfR = 8467200000;
}
rel.fps = 254016000000 / tpfR;
rel.timebase = tpfR;
var dfR = 0;
try {
var stR = seq.getSettings();
if ((stR) && (typeof stR.videoDisplayFormat === "number")) { 
dfR = stR.videoDisplayFormat;
}
} catch (eD2) {
}
rel.dropFrame = (dfR === 102) || (dfR === 106);
} catch (eFps) {
}
var nv = 0;
try {
nv = seq.videoTracks.numTracks;
} catch (eN) {nv = 0;
}
try {
var tr0 = seq.videoTracks[0];
var n0 = tr0 ? tr0.clips.numItems : 0;
for (var c0 = 0; c0 < n0; c0 += 1) { 
var cl0 = null;
try {
cl0 = tr0.clips[c0];
} catch (eC0) {continue ;
}
if (!cl0) { 
continue ;
}
var s0 = 0;
var e0 = 0;
var nm0 = "";
try {
s0 = parseFloat(cl0.start.seconds);
e0 = parseFloat(cl0.end.seconds);
} catch (eS0) {continue ;
}
try {
nm0 = String((cl0.name) || (""));
} catch (eNm0) {
}
if (nm0.indexOf(FS_GUIA_MARCA) >= 0) { 
continue ;
}
rel.cortes.push({dur: e0 - s0, ini: s0});}
} catch (eT0) {
}
for (var t = 0; t < nv; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var nc = 0;
try {
nc = tr.clips.numItems;
} catch (eC) {nc = 0;
}
for (var c = 0; c < nc; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eCl) {continue ;
}
if (!cl) { 
continue ;
}
var ehAjuste = false;
try {
ehAjuste = _fsCaEhAjuste(cl.projectItem);
} catch (eA) {ehAjuste = false;
}
if (!ehAjuste) { 
continue ;
}
var nossa = false;
try {
nossa = _fsZEhNossaCamada(cl);
} catch (eNo) {nossa = false;
}
if (!nossa) { 
continue ;
}
var zs = 0;
var ze = 0;
try {
zs = parseFloat(cl.start.seconds);
ze = parseFloat(cl.end.seconds);
} catch (eZ) {continue ;
}
rel.zooms.push({dur: ze - zs, fim: ze, ini: zs, trilha: "V" + t + 1});}}
for (var t2 = 0; t2 < nv; t2 += 1) { 
var tr2 = null;
try {
tr2 = seq.videoTracks[t2];
} catch (eT2) {continue ;
}
if ((!tr2) || (!tr2.transitions)) { 
continue ;
}
var nt = 0;
try {
nt = tr2.transitions.numItems;
} catch (eNt) {nt = 0;
}
for (var q = 0; q < nt; q += 1) { 
var trn = null;
try {
trn = tr2.transitions[q];
} catch (eGt) {continue ;
}
if (!trn) { 
continue ;
}
var tn = "";
var ti = 0;
var tf = 0;
try {
tn = String((trn.name) || (""));
} catch (eTn) {
}
try {
ti = parseFloat(trn.start.seconds);
} catch (eTi) {continue ;
}
try {
tf = parseFloat(trn.end.seconds);
} catch (eTf) {tf = ti;
}
rel.transicoes.push({dur: tf - ti, ini: ti, nome: tn, trilha: "V" + t2 + 1});}}
var na = 0;
try {
na = seq.audioTracks.numTracks;
} catch (eNa) {na = 0;
}
for (var a = 0; a < na; a += 1) { 
var ta = null;
try {
ta = seq.audioTracks[a];
} catch (eTa) {continue ;
}
if (!ta) { 
continue ;
}
var nomeT = "";
try {
nomeT = String((ta.name) || (""));
} catch (eNt2) {
}
if (_fsSemAcento(nomeT).toLowerCase().indexOf("fs sfx") < 0) { 
continue ;
}
rel.trilhaSfx = "A" + a + 1;
var nca = 0;
try {
nca = ta.clips.numItems;
} catch (eCa) {nca = 0;
}
for (var ca = 0; ca < nca; ca += 1) { 
var cla = null;
try {
cla = ta.clips[ca];
} catch (eCla) {continue ;
}
if (!cla) { 
continue ;
}
var as1 = 0;
var ae1 = 0;
var an = "";
try {
as1 = parseFloat(cla.start.seconds);
ae1 = parseFloat(cla.end.seconds);
} catch (eAs) {continue ;
}
try {
an = String((cla.name) || (""));
} catch (eAn) {
}
rel.sfx.push({dur: ae1 - as1, ini: as1, nome: an, trilha: "A" + a + 1});}}
rel.legendas = [];
rel.buracos = [];
try {
var faixasL = [];
for (var tl = 0; tl < nv; tl += 1) { 
var trL = null;
try {
trL = seq.videoTracks[tl];
} catch (eTl) {continue ;
}
if (!trL) { 
continue ;
}
for (var cl = 0; cl < trL.clips.numItems; cl += 1) { 
var clL = null;
try {
clL = trL.clips[cl];
} catch (eCl) {continue ;
}
if (!clL) { 
continue ;
}
var mgtL = null;
try {
mgtL = clL.getMGTComponent();
} catch (eMg) {mgtL = null;
}
if (!mgtL) { 
continue ;
}
var li = 0;
var lf = 0;
try {
li = clL.start.seconds;
lf = clL.end.seconds;
} catch (eLs) {continue ;
}
if (!(lf > li)) { 
continue ;
}
faixasL.push([li, lf]);}}
faixasL.sort(function (x, y) {
return x[0] - y[0];
});
rel.legendas = faixasL.length;
var fimConteudo = 0;
for (var tv2 = 0; tv2 < nv; tv2 += 1) { 
var trV = null;
try {
trV = seq.videoTracks[tv2];
} catch (eTv) {continue ;
}
if (!trV) { 
continue ;
}
for (var cv2 = 0; cv2 < trV.clips.numItems; cv2 += 1) { 
var clV = null;
try {
clV = trV.clips[cv2];
} catch (eCv2) {continue ;
}
if (!clV) { 
continue ;
}
var mgtV = null;
try {
mgtV = clV.getMGTComponent();
} catch (eMv) {mgtV = null;
}
if (mgtV) { 
continue ;
}
var fv = 0;
try {
fv = clV.end.seconds;
} catch (eFv) {fv = 0;
}
if (fv > fimConteudo) { 
fimConteudo = fv;
}}}
if (!(fimConteudo > 0)) { 
fimConteudo = (rel.duracao) || (0);
}
if (faixasL.length) { 
var fundidas = [faixasL[0].slice(0)];
for (var fu = 1; fu < faixasL.length; fu += 1) { 
var ult = fundidas[fundidas.length - 1];
if (faixasL[fu][0] <= (ult[1] + 0.001)) { 
if (faixasL[fu][1] > ult[1]) { 
ult[1] = faixasL[fu][1];
}
}
else {
fundidas.push(faixasL[fu].slice(0));
}}
rel.primeiraLegenda = fundidas[0][0];
for (var bu = 1; bu < fundidas.length; bu += 1) { 
var vao = fundidas[bu][0] - fundidas[bu - 1][1];
if (vao >= 0.4) { 
var antesNome = "";
var antesTr = "";
var depoisNome = "";
var depoisTr = "";
var fimAntes = fundidas[bu - 1][1];
var iniDepois = fundidas[bu][0];
for (var vt = 0; vt < nv; vt += 1) { 
var trVz = null;
try {
trVz = seq.videoTracks[vt];
} catch (eTz) {continue ;
}
if (!trVz) { 
continue ;
}
for (var cz = 0; cz < trVz.clips.numItems; cz += 1) { 
var clZ = null;
try {
clZ = trVz.clips[cz];
} catch (eCz) {continue ;
}
if (!clZ) { 
continue ;
}
var mgZ = null;
try {
mgZ = clZ.getMGTComponent();
} catch (eMz) {mgZ = null;
}
if (!mgZ) { 
continue ;
}
var fz = 0;
var iz = 0;
var nz = "";
try {
fz = clZ.end.seconds;
iz = clZ.start.seconds;
nz = String((clZ.name) || (""));
} catch (eNz) {continue ;
}
if ((Math.abs(fz - fimAntes) < 0.02) && (!antesNome)) { 
antesNome = nz;
antesTr = "V" + vt + 1;
}
if ((Math.abs(iz - iniDepois) < 0.02) && (!depoisNome)) { 
depoisNome = nz;
depoisTr = "V" + vt + 1;
}}}
rel.buracos.push({antes: antesNome, antesTrilha: antesTr, depois: depoisNome, depoisTrilha: depoisTr, dur: vao, fim: iniDepois, ini: fimAntes});
}}
var sobra = fimConteudo - fundidas[fundidas.length - 1][1];
if (sobra >= 0.4) { 
rel.buracos.push({dur: sobra, fim: fimConteudo, fimDoVideo: 1, ini: fundidas[fundidas.length - 1][1]});
}
var coberto = 0;
for (var cb = 0; cb < fundidas.length; cb += 1) { 
coberto += (fundidas[cb][1] - fundidas[cb][0]);}
rel.cobertura = fimConteudo > 0 ? coberto / fimConteudo : 0;
}
rel.fimConteudo = fimConteudo;
} catch (eBur) {rel.buracosErro = String(eBur);
}
return _fsJSON.stringify(rel);
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsGuiaProporcao(seq) {
try {
var w = (parseInt(seq.frameSizeHorizontal, 10)) || (0);
var h = (parseInt(seq.frameSizeVertical, 10)) || (0);
if ((!w) || (!h)) { 
return null;
}
var v = w / h;
if ((Math.abs(v - 0.5625) / 0.5625) < 0.015) { 
return {chave: "916", h: h, rotulo: "9:16", w: w};
}
if ((Math.abs(v - 1.7777777777777777) / 1.7777777777777777) < 0.015) { 
return {chave: "169", h: h, rotulo: "16:9", w: w};
}
var rot = v >= 1 ? (Math.round(v * 100) / 100) + ":1" : "1:" + (Math.round((1 / v) * 100) / 100);
return {chave: null, h: h, rotulo: rot, w: w};
} catch (e) {return null;
}
}
function _fsGuiaArquivo(raiz, tipo, escolha, prop) {
if (!escolha) { 
return "";
}
if (tipo === "plataforma") { 
if (prop !== "916") { 
return "";
}
return raiz + "/guias/plat_" + escolha + "_916.png";
}
return raiz + "/guias/grade_" + escolha + "_" + prop + ".png";
}
function _fsGuiaBin() {
var raizP = app.project.rootItem;
var n = 0;
try {
n = raizP.children.numItems;
} catch (eN) {n = 0;
}
for (var i = 0; i < n; i += 1) { 
var it = null;
try {
it = raizP.children[i];
} catch (eI) {continue ;
}
if (!it) { 
continue ;
}
var ehBin = false;
try {
ehBin = parseInt(it.type, 10) === 2;
} catch (eT) {
}
if ((ehBin) && (String(it.name) === FS_GUIA_BIN)) { 
return it;
}}
var novo = null;
try {
novo = raizP.createBin(FS_GUIA_BIN);
} catch (eC) {novo = null;
}
return novo;
}
function _fsGuiaNormalizar(s) {
return String((s) || ("")).replace(/\\/g, "/").toLowerCase();
}
function _fsGuiaAchaItem(pasta, alvo) {
var n = 0;
try {
n = pasta.children.numItems;
} catch (eN) {return null;
}
for (var i = 0; i < n; i += 1) { 
var it = null;
try {
it = pasta.children[i];
} catch (eI) {continue ;
}
if (!it) { 
continue ;
}
var cam = "";
try {
cam = it.getMediaPath ? it.getMediaPath() : "";
} catch (eM) {cam = "";
}
if ((cam) && (_fsGuiaNormalizar(cam) === alvo)) { 
return it;
}
var ehBin = false;
try {
ehBin = parseInt(it.type, 10) === 2;
} catch (eT) {
}
if (ehBin) { 
var dentro = _fsGuiaAchaItem(it, alvo);
if (dentro) { 
return dentro;
}
}}
return null;
}
function _fsGuiaItem(caminho) {
var arq = new File(caminho);
if (!arq.exists) { 
return null;
}
var alvo = _fsGuiaNormalizar(arq.fsName);
var achado = _fsGuiaAchaItem(app.project.rootItem, alvo);
if (achado) { 
return achado;
}
var bin = _fsGuiaBin();
try {
app.project.importFiles([arq.fsName], true, bin, false);
} catch (eImp) {
}
return _fsGuiaAchaItem(app.project.rootItem, alvo);
}
function _fsGuiaEhNosso(clipe) {
try {
return String(clipe.name).indexOf(FS_GUIA_MARCA) >= 0;
} catch (e) {return false;
}
}
function _fsGuiaVarrer(seq) {
var achados = [];
var nt = 0;
try {
nt = seq.videoTracks.numTracks;
} catch (eT) {return achados;
}
for (var t = 0; t < nt; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eTr) {continue ;
}
if (!tr) { 
continue ;
}
var nc = 0;
try {
nc = tr.clips.numItems;
} catch (eC) {continue ;
}
for (var c = nc - 1; c >= 0; c--) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eCl) {continue ;
}
if ((cl) && (_fsGuiaEhNosso(cl))) { 
achados.push({clipe: cl, trilha: t});
}}}
return achados;
}
function _fsGuiaLimpar(seq) {
var achados = _fsGuiaVarrer(seq);
var fora = 0;
for (var i = 0; i < achados.length; i += 1) { 
try {
var tr = seq.videoTracks[achados[i].trilha];
if (((tr) && (tr.isLocked)) && (tr.isLocked())) { 
continue ;
}
achados[i].clipe.remove(false, true);
fora++;
} catch (eR) {
}}
return fora;
}
function _fsGuiaFimDaSequencia(seq) {
var s = 0;
try {
s = parseFloat(seq.end) / 254016000000;
} catch (eE) {s = 0;
}
if (s > 0) { 
return s;
}
var nt = 0;
try {
nt = seq.videoTracks.numTracks;
} catch (eT) {nt = 0;
}
for (var t = 0; t < nt; t += 1) { 
try {
var tr = seq.videoTracks[t];
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var f = parseFloat(tr.clips[c].end.seconds);
if (f > s) { 
s = f;
}}
} catch (eC) {
}}
return s > 0 ? s : 10;
}
function _fsGuiaIntervalo(seq, escopo) {
var fimSeq = _fsGuiaFimDaSequencia(seq);
if (escopo === "inout") { 
var iS = NaN;
var oS = NaN;
try {
var iT = seq.getInPointAsTime();
if ((iT) && (typeof iT.seconds === "number")) { 
iS = iT.seconds;
}
} catch (e1) {
}
try {
var oT = seq.getOutPointAsTime();
if ((oT) && (typeof oT.seconds === "number")) { 
oS = oT.seconds;
}
} catch (e2) {
}
if (isNaN(iS)) { 
try {
iS = parseFloat(seq.getInPoint());
} catch (e3) {
}
}
if (isNaN(oS)) { 
try {
oS = parseFloat(seq.getOutPoint());
} catch (e4) {
}
}
if (isNaN(iS)) { 
iS = 0;
}
if (isNaN(oS)) { 
oS = 0;
}
if (!(oS > (iS + 0.001))) { 
return {erro: "SEM_INOUT"};
}
return {de: "in/out", fim: oS, ini: iS};
}
if (escopo === "clipe") { 
function _olhar(colecao, nT) {
for (var t = 0; t < nT; t += 1) { 
var tr = null;
try {
tr = colecao[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var n = 0;
try {
n = tr.clips.numItems;
} catch (eN) {continue ;
}
for (var c = 0; c < n; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = !(!cl.isSelected());
} catch (eS) {sel = false;
}
if (!sel) { 
continue ;
}
var s = NaN;
var e = NaN;
try {
s = parseFloat(cl.start.seconds);
e = parseFloat(cl.end.seconds);
} catch (eP) {continue ;
}
if ((isNaN(s)) || (isNaN(e))) { 
continue ;
}
quantos++;
if ((ini < 0) || (s < ini)) { 
ini = s;
}
if (e > fim) { 
fim = e;
}}}
}
var ini = -1;
var fim = -1;
var quantos = 0;
try {
_olhar(seq.videoTracks, seq.videoTracks.numTracks);
} catch (eV) {
}
try {
_olhar(seq.audioTracks, seq.audioTracks.numTracks);
} catch (eA) {
}
if ((!quantos) || (!(fim > ini))) { 
return {erro: "SEM_SELECAO"};
}
return {de: quantos + " clipe(s) selecionado(s)", fim: fim, ini: ini};
}
return {de: "sequ\xeancia inteira", fim: fimSeq, ini: 0};
}
function _fsGuiaLivreNoTrecho(tr, ini, fim) {
var n = 0;
try {
n = tr.clips.numItems;
} catch (eC) {return false;
}
for (var c = 0; c < n; c += 1) { 
var s = NaN;
var e = NaN;
try {
s = parseFloat(tr.clips[c].start.seconds);
e = parseFloat(tr.clips[c].end.seconds);
} catch (eP) {continue ;
}
if ((isNaN(s)) || (isNaN(e))) { 
continue ;
}
if ((s < (fim - 0.001)) && (e > (ini + 0.001))) { 
return false;
}}
return true;
}
function _fsGuiaTrilhaEscolhida(seq, pedida, ini, fim) {
var tr = null;
try {
tr = seq.videoTracks[pedida];
} catch (eT) {return -1;
}
if (!tr) { 
return -1;
}
try {
if ((tr.isLocked) && (tr.isLocked())) { 
return -3;
}
} catch (eL) {
}
try {
if (typeof tr.clips.numItems !== "number") { 
return -1;
}
} catch (eC) {return -1;
}
if (!_fsGuiaLivreNoTrecho(tr, ini, fim)) { 
return -2;
}
return pedida;
}
function _fsGuiaTrilhaDeCima(seq, ini, fim) {
var n = 0;
try {
n = seq.videoTracks.numTracks;
} catch (eN) {return -1;
}
if (n > 0) { 
var topo = null;
try {
topo = seq.videoTracks[n - 1];
} catch (eT) {topo = null;
}
var vazia = false;
var travada = false;
try {
vazia = _fsGuiaLivreNoTrecho(topo, ini, fim);
} catch (eV) {
}
try {
travada = (topo.isLocked) && (topo.isLocked());
} catch (eL) {
}
if ((vazia) && (!travada)) { 
return n - 1;
}
}
if (!_fsAddTrilhaVideo(seq)) { 
return -1;
}
var depois = 0;
try {
depois = seq.videoTracks.numTracks;
} catch (eD) {return -1;
}
return depois > n ? depois - 1 : -1;
}
function _fsGuiaAjustar(clipe, escala, opacidade) {
var res = {escalou: 0, opacou: 0};
var compMo = null;
var compOp = null;
try {
for (var i = 0; i < clipe.components.numItems; i += 1) { 
var c = null;
try {
c = clipe.components[i];
} catch (eI) {continue ;
}
if (!c) { 
continue ;
}
var n = "";
var mn = "";
try {
n = _fsSemAcento(c.displayName);
} catch (eN) {
}
try {
mn = String(c.matchName);
} catch (eM) {
}
if ((!compMo) && ((((n.indexOf("motion") === 0) || (n.indexOf("movimento") === 0)) || (mn === "AE.ADBE Motion")) || (mn === "ADBE Motion"))) { 
compMo = c;
}
if ((!compOp) && ((((n.indexOf("opacity") === 0) || (n.indexOf("opacidade") === 0)) || (mn === "AE.ADBE Opacity")) || (mn === "ADBE Opacity"))) { 
compOp = c;
}}
} catch (eC) {
}
if (((compMo) && (escala > 0)) && (Math.abs(escala - 100) > 0.5)) { 
var pEsc = _fsZProp(compMo, _fsNomesDe("propEscala"), _fsNomesDe("propEscalaUnif"));
if (pEsc) { 
try {
pEsc.setValue(escala, true);
res.escalou = 1;
} catch (eE) {
}
}
}
if ((((compOp) && (typeof opacidade === "number")) && (opacidade >= 0)) && (opacidade < 100)) { 
var pOp = _fsZProp(compOp, _fsNomesDe("propOpacidade"));
if (pOp) { 
try {
pOp.setValue(opacidade, true);
res.opacou = 1;
} catch (eO) {
}
}
}
return res;
}
function _fsGuiaEscalaPara(prop) {
if (((!prop) || (!prop.chave)) || (!prop.w)) { 
return 100;
}
var ref = FS_GUIA_REF[prop.chave];
if (!ref) { 
return 100;
}
return (prop.w / ref) * 100;
}
function _fsGuiaPor(seq, item, trilha, iniSeg, fimSeg, rotulo, escala, opacidade) {
var tr = null;
try {
tr = seq.videoTracks[trilha];
} catch (eT) {return null;
}
if (!tr) { 
return null;
}
var antes = 0;
try {
antes = tr.clips.numItems;
} catch (eA) {
}
try {
tr.overwriteClip(item, String(Math.round(iniSeg * 254016000000)));
} catch (eO) {return null;
}
var depois = 0;
try {
depois = tr.clips.numItems;
} catch (eD) {
}
if (depois <= antes) { 
return null;
}
var posto = null;
try {
for (var b = tr.clips.numItems - 1; b >= 0; b--) { 
var cand = tr.clips[b];
var cs = NaN;
try {
cs = parseFloat(cand.start.seconds);
} catch (eCs) {continue ;
}
if ((!isNaN(cs)) && (Math.abs(cs - iniSeg) < 0.05)) { 
posto = cand;
break ;
}}
} catch (eP) {
}
if (!posto) { 
try {
posto = tr.clips[tr.clips.numItems - 1];
} catch (eP2) {
}
}
if (!posto) { 
return null;
}
try {
var fim = new Time();
fim.seconds = fimSeg;
posto.end = fim;
} catch (eE) {
}
try {
posto.name = FS_GUIA_NOME + " (" + rotulo + ")";
} catch (eN) {
}
var aj = _fsGuiaAjustar(posto, escala, opacidade);
posto._fsEscalou = aj.escalou;
posto._fsOpacou = aj.opacou;
return posto;
}
function fsGuiaEstado() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({ok: true, temSeq: false});
}
var prop = _fsGuiaProporcao(seq);
var achados = _fsGuiaVarrer(seq);
var nomes = [];
for (var i = 0; i < achados.length; i += 1) { 
try {
nomes.push(String(achados[i].clipe.name));
} catch (eN) {
}}
return _fsJSON.stringify({altura: prop ? prop.h : 0, guias: achados.length, largura: prop ? prop.w : 0, nomes: nomes.join(" | "), ok: true, proporcao: prop ? prop.chave : null, rotulo: prop ? prop.rotulo : "?", sequencia: String((seq.name) || ("")), temSeq: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsGuiaAplicar(optsJson) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var raiz = String((o.raiz) || ("")).replace(/\\/g, "/");
if (!raiz) { 
return _fsJSON.stringify({error: "Caminho da extens\xe3o indispon\xedvel."});
}
var prop = _fsGuiaProporcao(seq);
if (!prop) { 
return _fsJSON.stringify({error: "N\xe3o consegui ler o tamanho da sequ\xeancia."});
}
var fora = _fsGuiaLimpar(seq);
if ((!o.plataforma) && (!o.grade)) { 
return _fsJSON.stringify({ok: true, postas: 0, proporcao: prop.chave, removidas: fora, rotulo: prop.rotulo});
}
if (!prop.chave) { 
return _fsJSON.stringify({error: "SEM_PROPORCAO", removidas: fora, rotulo: prop.rotulo});
}
var pedidos = [];
if (o.plataforma) { 
pedidos.push({escolha: String(o.plataforma), tipo: "plataforma"});
}
if (o.grade) { 
pedidos.push({escolha: String(o.grade), tipo: "grade"});
}
var itens = [];
for (var i = 0; i < pedidos.length; i += 1) { 
var caminho = _fsGuiaArquivo(raiz, pedidos[i].tipo, pedidos[i].escolha, prop.chave);
if (!caminho) { 
return _fsJSON.stringify({error: "SEM_ARQUIVO", escolha: pedidos[i].escolha, removidas: fora, rotulo: prop.rotulo, tipo: pedidos[i].tipo});
}
var item = _fsGuiaItem(caminho);
if (!item) { 
return _fsJSON.stringify({error: "N\xe3o achei o arquivo da guia: " + caminho, removidas: fora});
}
itens.push({item: item, rotulo: pedidos[i].escolha});}
var pedida = parseInt(o.trilha, 10);
if (isNaN(pedida)) { 
pedida = -1;
}
var faixa = _fsGuiaIntervalo(seq, String((o.escopo) || ("seq")));
if (faixa.erro) { 
return _fsJSON.stringify({error: faixa.erro, removidas: fora, rotulo: prop.rotulo});
}
var iniSeg = faixa.ini;
var fimSeg = faixa.fim;
var escala = _fsGuiaEscalaPara(prop);
var opac = parseFloat(o.opacidade);
if (isNaN(opac)) { 
opac = 100;
}
var postas = 0;
var criadas = 0;
var trilhas = [];
var escalou = 0;
var opacou = 0;
for (var k = 0; k < itens.length; k += 1) { 
var antesN = 0;
try {
antesN = seq.videoTracks.numTracks;
} catch (eAn) {
}
if ((pedida >= 0) && (k === 0)) { 
tIdx = _fsGuiaTrilhaEscolhida(seq, pedida, iniSeg, fimSeg);
if (tIdx === -2) { 
return _fsJSON.stringify({error: "TRILHA_OCUPADA", removidas: fora, trilha: "V" + pedida + 1});
}
if (tIdx === -3) { 
return _fsJSON.stringify({error: "TRILHA_TRAVADA", removidas: fora, trilha: "V" + pedida + 1});
}
if (tIdx < 0) { 
return _fsJSON.stringify({error: "TRILHA_INEXISTENTE", removidas: fora, trilha: "V" + pedida + 1});
}
}
else {
tIdx = _fsGuiaTrilhaDeCima(seq, iniSeg, fimSeg);
}
if (tIdx < 0) { 
return _fsJSON.stringify({error: "SEM_TRILHA", postas: postas, removidas: fora});
}
var depN = 0;
try {
depN = seq.videoTracks.numTracks;
} catch (eDn) {
}
if (depN > antesN) { 
criadas++;
}
var posto = _fsGuiaPor(seq, itens[k].item, tIdx, iniSeg, fimSeg, itens[k].rotulo, escala, opac);
if (posto) { 
postas++;
trilhas.push("V" + tIdx + 1);
if (posto._fsEscalou) { 
escalou++;
}
if (posto._fsOpacou) { 
opacou++;
}
}}
return _fsJSON.stringify({alturaSeq: prop.h, ate: fimSeg, de: iniSeg, escala: Math.round(escala), escalou: escalou, escopo: faixa.de, larguraSeq: prop.w, ok: true, opacidade: opac, opacou: opacou, postas: postas, proporcao: prop.chave, removidas: fora, rotulo: prop.rotulo, trilhas: trilhas.join(", "), trilhasCriadas: criadas});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsGuiaRemover() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var fora = _fsGuiaLimpar(seq);
var sobrou = _fsGuiaVarrer(seq).length;
return _fsJSON.stringify({ok: true, removidas: fora, sobrou: sobrou});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsIrParaTempo(segundos) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var s = parseFloat(segundos);
if ((isNaN(s)) || (s < 0)) { 
return _fsJSON.stringify({error: "tempo inv\xe1lido"});
}
var TPS = 254016000000;
var inteiro = Math.floor(s);
var resto = s - inteiro;
var ticks = (inteiro * TPS) + Math.round(resto * TPS);
var alvo = String(Math.round(ticks));
var ok = false;
try {
seq.setPlayerPosition(alvo);
ok = true;
} catch (e1) {
}
if (!ok) { 
try {
seq.setPlayerPosition(ticks);
ok = true;
} catch (e2) {
}
}
if (!ok) { 
return _fsJSON.stringify({error: "esta vers\xe3o do Premiere n\xe3o deixou mover a agulha"});
}
var onde = "";
try {
onde = String(seq.getPlayerPosition().seconds);
} catch (e3) {
}
return _fsJSON.stringify({agulha: onde, ok: true, segundos: s});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsPontaNaAgulha() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "semSequencia"});
}
var sel = null;
try {
sel = seq.getSelection();
} catch (eS) {
}
if ((!sel) || (!sel.length)) { 
return _fsJSON.stringify({error: "semSelecao"});
}
var cti = null;
try {
cti = seq.getPlayerPosition();
} catch (eC) {
}
if ((!cti) || (!cti.ticks)) { 
return _fsJSON.stringify({error: "semAgulha"});
}
var ctiT = parseFloat(cti.ticks);
var TPS = typeof _FS_AC_TPS !== "undefined" ? _FS_AC_TPS : 254016000000;
var TOL = TPS * 0.02;
var esticados = 0;
var encurtados = 0;
var presos = 0;
var pulados = 0;
for (var i = 0; i < sel.length; i += 1) { 
var clip = sel[i];
if (!clip) { 
continue ;
}
var ehVideo = false;
try {
ehVideo = ("" + clip.mediaType).toLowerCase().indexOf("video") !== -1;
} catch (eM) {
}
if (!ehVideo) { 
try {
ehVideo = !(!((clip.components) && (clip.components.numItems)));
} catch (eM2) {
}
}
if (!ehVideo) { 
pulados++;
continue ;
}
var st = NaN;
var era = NaN;
try {
st = parseFloat(clip.start.ticks);
era = parseFloat(clip.end.ticks);
} catch (eT) {
}
if ((isNaN(st)) || (isNaN(era))) { 
pulados++;
continue ;
}
if (ctiT <= (st + TOL)) { 
pulados++;
continue ;
}
var alvo = ctiT;
var novo = NaN;
try {
var eObj = clip.end;
eObj.ticks = "" + alvo;
clip.end = eObj;
novo = parseFloat(clip.end.ticks);
} catch (eE) {
}
if ((!isNaN(novo)) && (Math.abs(novo - alvo) <= TOL)) { 
if (alvo > era) { 
esticados++;
}
else {
encurtados++;
}
continue ;
}
try {
var inP = 0;
try {
inP = parseFloat(clip.inPoint.ticks);
} catch (eI) {
}
var oObj = clip.outPoint;
oObj.ticks = "" + inP + (alvo - st);
clip.outPoint = oObj;
var eObj2 = clip.end;
eObj2.ticks = "" + alvo;
clip.end = eObj2;
novo = parseFloat(clip.end.ticks);
} catch (eO) {
}
if ((!isNaN(novo)) && (Math.abs(novo - alvo) <= TOL)) { 
if (alvo > era) { 
esticados++;
}
else {
encurtados++;
}
}
else {
presos++;
}}
return _fsJSON.stringify({encurtados: encurtados, esticados: esticados, ok: true, presos: presos, pulados: pulados});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsSelecaoVideoConta() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({n: 0});
}
var sel = null;
try {
sel = seq.getSelection();
} catch (eS) {
}
var n = 0;
if (sel) { 
for (var i = 0; i < sel.length; i += 1) { 
var c = sel[i];
if (!c) { 
continue ;
}
var v = false;
try {
v = ("" + c.mediaType).toLowerCase().indexOf("video") !== -1;
} catch (eM) {
}
if (!v) { 
try {
v = !(!((c.components) && (c.components.numItems)));
} catch (eM2) {
}
}
if (v) { 
n++;
}}
}
return _fsJSON.stringify({n: n});
} catch (e) {return _fsJSON.stringify({n: 0});
}
}
function fsCriarTrilhaVideo() {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "semSequencia"});
}
var antes = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
var depois = seq.videoTracks.numTracks;
return _fsJSON.stringify({antes: antes, depois: depois, ok: depois > antes});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsTrilhaLivreNoIntervalo(iniSec, fimSec) {
try {
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "semSequencia"});
}
var ini = parseFloat(iniSec);
var fim = parseFloat(fimSec);
if (((isNaN(ini)) || (isNaN(fim))) || (fim <= ini)) { 
return _fsJSON.stringify({error: "intervaloInvalido"});
}
var n = seq.videoTracks.numTracks;
for (var t = 0; t < n; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
var travada = false;
try {
travada = tr.isLocked();
} catch (eL) {
}
if (travada) { 
continue ;
}
var livre = true;
try {
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = tr.clips[c];
if ((cl.start.seconds < fim) && (cl.end.seconds > ini)) { 
livre = false;
break ;
}}
} catch (eC) {livre = false;
}
if (livre) { 
return _fsJSON.stringify({criada: false, ok: true, total: n, trilha: t});
}}
var antes = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
var depois = seq.videoTracks.numTracks;
if (depois > antes) { 
return _fsJSON.stringify({criada: true, ok: true, total: depois, trilha: depois - 1});
}
return _fsJSON.stringify({error: "semTrilhaLivre"});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsAddTrilhaVideo(seq) {
try {
function _subiu() {
var agora = -1;
try {
agora = seq.videoTracks.numTracks;
} catch (eN2) {return false;
}
return agora > antes;
}
if (!seq) { 
return false;
}
var antes = -1;
try {
antes = seq.videoTracks.numTracks;
} catch (eN) {return false;
}
if (antes < 0) { 
return false;
}
try {
seq.videoTracks.add();
} catch (e1) {
}
if (_subiu()) { 
return true;
}
var qs = null;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (e2) {
}
try {
qs = qe.project.getActiveSequence();
} catch (e3) {qs = null;
}
if ((qs) && (qs.addTracks)) { 
var idx = antes;
try {
qs.addTracks(1, idx, 0, 0, 0, 0, 0);
} catch (e4) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(1, idx, 0, 0, 0, 0);
} catch (e5) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(1, idx, 0, 0);
} catch (e6) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(1, idx);
} catch (e7) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(1);
} catch (e8) {
}
if (_subiu()) { 
return true;
}
try {
qs.addTracks(1, 0, 0, 0, 0, 0, 0);
} catch (e9) {
}
if (_subiu()) { 
return true;
}
}
return false;
} catch (e) {return false;
}
}
function fsSondaEfeitos(presetJson) {
try {
function P(t) {
L.push(String(t));
}
var L = [];
P("FRAME SPEED \u2014 SONDA DOS EFEITOS (por que o preset nao aplica)");
P("");
var qeOk = false;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
try {
qeOk = !(!((qe) && (qe.project)));
} catch (eQ2) {qeOk = false;
}
P("QE disponivel: " + qeOk ? "SIM" : "NAO");
if (!qeOk) { 
P("");
P(">>> Sem QE nao ha como adicionar efeito por script. Fim.");
}
else {
var listaV = null;
var erroV = "";
try {
listaV = qe.project.getVideoEffectList();
} catch (eL) {erroV = String(eL);
}
var nV = 0;
try {
nV = listaV ? listaV.length : 0;
} catch (eN) {nV = 0;
}
P("getVideoEffectList(): " + listaV ? nV + " efeitos" : "FALHOU \u2014 " + erroV);
if ((listaV) && (nV)) { 
var tipo0 = "";
try {
tipo0 = typeof listaV[0];
} catch (eT) {
}
P("tipo do item da lista: " + tipo0);
P("");
P("PRIMEIROS 12 EFEITOS DA SUA INSTALACAO:");
var lim = nV < 12 ? nV : 12;
for (var i = 0; i < lim; i += 1) { 
var nm = "";
try {
nm = typeof listaV[i] === "string" ? listaV[i] : String(listaV[i].name);
} catch (eNm) {nm = "?";
}
var mt = "";
try {
var ef = qe.project.getVideoEffectByName(nm);
if (ef) { 
try {
mt = String(ef.matchName);
} catch (eM) {mt = "(sem matchName)";
}
}
} catch (eE) {mt = "(erro)";
}
P("  " + i + 1 + ". " + nm + "   [" + mt + "]");}
P("");
P("PROCURANDO OS EFEITOS DO PRESET:");
var alvos = ["sombra", "shadow", "substitu", "replace", "cor", "color"];
for (var a = 0; a < alvos.length; a += 1) { 
var achou = [];
for (var j = 0; j < nV; j += 1) { 
var nj = "";
try {
nj = typeof listaV[j] === "string" ? listaV[j] : String(listaV[j].name);
} catch (eJ) {continue ;
}
if (String(nj).toLowerCase().indexOf(alvos[a]) !== -1) { 
achou.push(nj);
}
if (achou.length >= 4) { 
break ;
}}
P("  contem \"" + alvos[a] + "\": " + achou.length ? achou.join(" | ") : "(nenhum)");}
}
P("");
var oco = null;
try {
oco = qe.project.getVideoEffectByName("ZZZ_efeito_que_nao_existe_123");
} catch (eO) {oco = "erro";
}
var descOco = "null (bom: a versao nao devolve objeto oco)";
if (oco === "erro") { 
descOco = "lancou excecao";
}
else {
if (oco) { 
var nOco = "";
try {
nOco = String(oco.name);
} catch (eNo) {nOco = "(sem .name)";
}
descOco = "OBJETO OCO devolvido \u2014 .name = " + nOco;
}
}
P("nome inexistente devolve: " + descOco);
}
if (presetJson) { 
P("");
P("O QUE O PRESET GUARDOU:");
var pre = null;
try {
pre = _fsJSON.parse(presetJson);
} catch (eP) {
}
if ((pre) && (pre.comps)) { 
for (var c = 0; c < pre.comps.length; c += 1) { 
P("  efeito " + c + 1 + ": nome=\"" + pre.comps[c].displayName + "\"  matchName=\"" + pre.comps[c].matchName + "\"  intrinseco=" + pre.comps[c].intrinsic ? "sim" : "nao");}
}
else {
P("  (nao consegui ler o preset)");
}
}
P("");
P("CLIPE SELECIONADO:");
var seq = app.project.activeSequence;
if (!seq) { 
P("  (sem sequencia ativa)");
}
else {
var achouSel = false;
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = seq.videoTracks[t];
for (var k = 0; k < tr.clips.numItems; k += 1) { 
var cl = tr.clips[k];
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
achouSel = true;
var nomeCl = "";
try {
nomeCl = String(cl.name);
} catch (eNc) {
}
var ehMgt = false;
try {
ehMgt = !(!cl.getMGTComponent());
} catch (eMg) {
}
P("  V" + t + 1 + " \u2014 \"" + nomeCl + "\"  MOGRT=" + ehMgt ? "sim" : "nao");
var cps = null;
try {
cps = cl.components;
} catch (eCp) {
}
var nc = 0;
try {
nc = cps ? cps.numItems : 0;
} catch (eNn) {
}
P("    efeitos ja no clipe (" + nc + "):");
for (var q = 0; q < nc; q += 1) { 
var dn = "";
var mn = "";
try {
dn = String(cps[q].displayName);
} catch (eD) {
}
try {
mn = String(cps[q].matchName);
} catch (eMn) {
}
P("      - " + dn + "   [" + mn + "]");}}}
if (!achouSel) { 
P("  (nenhum clipe selecionado)");
}
}
var nome = "framespeed-sonda-efeitos.txt";
var f = new File(Folder.desktop.fsName + "/" + nome);
f.encoding = "UTF-8";
f.lineFeed = "Unix";
if (!f.open("w")) { 
return _fsJSON.stringify({error: "Nao consegui escrever no Desktop."});
}
f.write(L.join("\n"));
f.close();
return _fsJSON.stringify({arquivo: f.fsName, linhas: L.length, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsTdTps() {
return 254016000000;
}
function _fsTdPropMotion(comp, alvo) {
if (!comp) { 
return null;
}
var props = null;
try {
props = comp.properties;
} catch (e) {return null;
}
if (!props) { 
return null;
}
var n = 0;
try {
n = props.numItems;
} catch (e2) {return null;
}
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = props[i];
} catch (e3) {continue ;
}
if (!p) { 
continue ;
}
var dn = "";
var mn = "";
try {
dn = _fsSemAcento(String((p.displayName) || (""))).toLowerCase();
} catch (e4) {
}
try {
mn = String((p.matchName) || (""));
} catch (e5) {
}
var v = null;
try {
v = p.getValue();
} catch (e6) {continue ;
}
var ehLista = (((v !== null) && (typeof v === "object")) && (typeof v.length === "number")) && (v.length === 2);
var ehNumero = typeof v === "number";
if (alvo === "posicao") { 
if (!ehLista) { 
continue ;
}
if (((mn === "ADBE Position") || (dn.indexOf("posi") === 0)) || (dn.indexOf("position") === 0)) { 
return p;
}
}
if (alvo === "escala") { 
if (!ehNumero) { 
continue ;
}
if (((mn === "ADBE Scale") || (dn === "escala")) || (dn === "scale")) { 
return p;
}
}}
return null;
}
function _fsTdAchaCrop() {
var nomes = ["Crop", "Recorte", "Recortar", "Corte", "Zuschneiden", "Recadrage", "Ritaglia"];
for (var i = 0; i < nomes.length; i += 1) { 
eff = null;
try {
eff = qe.project.getVideoEffectByName(nomes[i]);
} catch (e) {eff = null;
}
if (_fsFxEfeitoVale(eff, nomes[i])) { 
return eff;
}}
var lista = _fsFxListaEfeitos("v");
for (var i = 0; i < lista.length; i += 1) { 
for (var j = 0; j < nomes.length; j += 1) { 
if (_fsFxNormNome(lista[i]) === _fsFxNormNome(nomes[j])) { 
eff = null;
try {
eff = qe.project.getVideoEffectByName(lista[i]);
} catch (e2) {eff = null;
}
if (_fsFxEfeitoVale(eff, lista[i])) { 
return eff;
}
}}}
return null;
}
function _fsTdTamanhoDaMidia(clip) {
var xmp = "";
try {
xmp = String(clip.projectItem.getProjectMetadata());
} catch (e) {return null;
}
if (!xmp) { 
return null;
}
var i = xmp.indexOf("VideoInfo");
var trecho = i >= 0 ? xmp.substring(i, i + 400) : xmp;
var m = trecho.match(/(\d{2,5})\s*[xX]\s*(\d{2,5})/);
if (!m) { 
return null;
}
var w = parseInt(m[1], 10);
var h = parseInt(m[2], 10);
if ((!(w > 0)) || (!(h > 0))) { 
return null;
}
return {h: h, w: w};
}
function _fsTdAchaEfeitoJanela() {
var eff = null;
try {
eff = qe.project.getVideoEffectByName("Rounded Crop");
} catch (e) {eff = null;
}
if (_fsFxEfeitoVale(eff, "Rounded Crop")) { 
return {eff: eff, tipo: "rounded"};
}
var lista = _fsFxListaEfeitos("v");
for (var i = 0; i < lista.length; i += 1) { 
if (_fsFxNormNome(lista[i]) === "roundedcrop") { 
try {
eff = qe.project.getVideoEffectByName(lista[i]);
} catch (e2) {eff = null;
}
if (_fsFxEfeitoVale(eff, lista[i])) { 
return {eff: eff, tipo: "rounded"};
}
}}
var nativo = _fsTdAchaCrop();
if (nativo) { 
return {eff: nativo, tipo: "crop"};
}
return {eff: null, tipo: ""};
}
function _fsTdCompCrop(clip) {
var comps = null;
try {
comps = clip.components;
} catch (e) {return null;
}
if (!comps) { 
return null;
}
for (var i = 0; i < comps.numItems; i += 1) { 
var c = null;
try {
c = comps[i];
} catch (e2) {continue ;
}
if (!c) { 
continue ;
}
var mn = "";
var dn2 = "";
try {
mn = String((c.matchName) || (""));
} catch (e3) {
}
try {
dn2 = _fsSemAcento(String((c.displayName) || (""))).toLowerCase();
} catch (e4) {
}
if (((mn.indexOf("Crop") !== -1) || (dn2.indexOf("crop") !== -1)) || (dn2.indexOf("recorte") !== -1)) { 
return c;
}}
return null;
}
function _fsTdBordasCrop(comp) {
var out = {base: null, difusao: null, direita: null, esquerda: null, roundness: null, topo: null};
var props = null;
try {
props = comp.properties;
} catch (e) {return out;
}
var n = 0;
try {
n = props.numItems;
} catch (e2) {return out;
}
var numericas = [];
for (var i = 0; i < n; i += 1) { 
var p = null;
try {
p = props[i];
} catch (e3) {continue ;
}
if (!p) { 
continue ;
}
var v = null;
try {
v = p.getValue();
} catch (e4) {continue ;
}
if (typeof v !== "number") { 
continue ;
}
numericas.push(p);
var dn = "";
var mn = "";
try {
dn = _fsSemAcento(String((p.displayName) || (""))).toLowerCase();
} catch (e5) {
}
try {
mn = String((p.matchName) || (""));
} catch (e6) {
}
if ((dn.indexOf("left") !== -1) || (dn.indexOf("esquerda") !== -1)) { 
if (!out.esquerda) { 
out.esquerda = p;
}
continue ;
}
if (((dn.indexOf("top") !== -1) || (dn.indexOf("superior") !== -1)) || (dn.indexOf("cima") !== -1)) { 
if (!out.topo) { 
out.topo = p;
}
continue ;
}
if ((dn.indexOf("right") !== -1) || (dn.indexOf("direita") !== -1)) { 
if (!out.direita) { 
out.direita = p;
}
continue ;
}
if (((dn.indexOf("bottom") !== -1) || (dn.indexOf("inferior") !== -1)) || (dn.indexOf("baixo") !== -1)) { 
if (!out.base) { 
out.base = p;
}
continue ;
}
if (mn.indexOf("-0001") !== -1) { 
if (!out.esquerda) { 
out.esquerda = p;
}
continue ;
}
if (mn.indexOf("-0002") !== -1) { 
if (!out.topo) { 
out.topo = p;
}
continue ;
}
if (mn.indexOf("-0003") !== -1) { 
if (!out.direita) { 
out.direita = p;
}
continue ;
}
if (mn.indexOf("-0004") !== -1) { 
if (!out.base) { 
out.base = p;
}
continue ;
}
if ((((dn.indexOf("feather") !== -1) || (dn.indexOf("difus") !== -1)) || (dn.indexOf("suaviz") !== -1)) || (dn.indexOf("aresta") !== -1)) { 
if (!out.difusao) { 
out.difusao = p;
}
continue ;
}
if ((dn.indexOf("roundness") !== -1) && (dn.indexOf("custom") === -1)) { 
if (!out.roundness) { 
out.roundness = p;
}
continue ;
}}
if (((((!out.esquerda) && (!out.topo)) && (!out.direita)) && (!out.base)) && (numericas.length >= 4)) { 
out.esquerda = numericas[0];
out.topo = numericas[1];
out.direita = numericas[2];
out.base = numericas[3];
if ((!out.difusao) && (numericas.length >= 5)) { 
out.difusao = numericas[4];
}
}
return out;
}
function _fsTdGrava(prop, valor) {
if (!prop) { 
return false;
}
try {
prop.setValue(valor, true);
} catch (e1) {try {
prop.setValue(valor);
} catch (e2) {return false;
}
}
var lido = null;
try {
lido = prop.getValue();
} catch (e3) {return false;
}
if ((typeof valor === "number") && (typeof lido === "number")) { 
return Math.abs(lido - valor) < 0.51;
}
if (((valor !== null) && (typeof valor === "object")) && (typeof valor.length === "number")) { 
if ((lido === null) || (typeof lido !== "object")) { 
return false;
}
for (var i = 0; i < valor.length; i += 1) { 
if (Math.abs(Number(lido[i]) - Number(valor[i])) > 0.01) { 
return false;
}}
return true;
}
return true;
}
function _fsTdSelecionados(seq) {
var out = [];
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var sel = false;
try {
sel = cl.isSelected();
} catch (eS) {
}
if (!sel) { 
continue ;
}
var ini = 0;
var fim = 0;
try {
ini = parseFloat(cl.start.seconds);
fim = parseFloat(cl.end.seconds);
} catch (eT2) {continue ;
}
out.push({clip: cl, fim: fim, ini: ini, nome: String((cl.name) || ("")), trilha: t});}}
return out;
}
function _fsTdPedaco(seq, trilha, iniSec, tolSec) {
var tr = null;
try {
tr = seq.videoTracks[trilha];
} catch (e) {return null;
}
if (!tr) { 
return null;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (e2) {continue ;
}
if (!cl) { 
continue ;
}
var s = 0;
try {
s = parseFloat(cl.start.seconds);
} catch (e3) {continue ;
}
if (Math.abs(s - iniSec) <= tolSec) { 
return cl;
}}
return null;
}
function fsTelaDividida(optsJson) {
try {
function _corta(trilha, seg) {
if (!qs) { 
return;
}
var tc = _fsAcTicksToTC(Math.round(seg * TPS), tpf, disp);
try {
qs.getVideoTrackAt(trilha).razor(tc);
cortes++;
} catch (eR) {
}
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var sel = _fsTdSelecionados(seq);
if (sel.length === 0) { 
return _fsJSON.stringify({error: "Selecione DOIS clipes de v\xeddeo na timeline (um em cima do outro, cruzando no tempo)."});
}
if (sel.length === 1) { 
return _fsJSON.stringify({error: "S\xf3 um clipe selecionado. A tela dividida precisa de dois."});
}
if (sel.length > 2) { 
return _fsJSON.stringify({error: sel.length + " clipes selecionados. Selecione exatamente dois."});
}
var lw = 1920;
var lh = 1080;
try {
var st = seq.getSettings();
if (st) { 
if (st.videoFrameWidth) { 
lw = st.videoFrameWidth;
}
if (st.videoFrameHeight) { 
lh = st.videoFrameHeight;
}
}
} catch (eS) {
}
try {
if (seq.frameSizeHorizontal) { 
lw = seq.frameSizeHorizontal;
}
if (seq.frameSizeVertical) { 
lh = seq.frameSizeVertical;
}
} catch (eF) {
}
var janela = String(o.janela) === "baixo" ? "baixo" : "cima";
var difusao = 0;
if (String(o.difusao) === "suave") { 
difusao = 7;
}
else if (String(o.difusao) === "forte") {
difusao = 18;
}
else {
if ((!isNaN(parseFloat(o.difusao))) && (parseFloat(o.difusao) > 0)) { 
difusao = parseFloat(o.difusao);
}
}
if (difusao > 40) { 
difusao = 40;
}
sel.sort(function (a, b) {
return b.trilha - a.trilha;
});
var alto = sel[0];
var baixo = sel[1];
if (alto.trilha === baixo.trilha) { 
alto = sel[0];
baixo = sel[1];
if (alto.ini > baixo.ini) { 
var _tmp = alto;
alto = baixo;
baixo = _tmp;
}
}
var empilhou = 0;
var trilhaNova = -1;
var iIni = Math.max(alto.ini, baixo.ini);
var iFim = Math.min(alto.fim, baixo.fim);
var TPS = _fsTdTps();
if ((!(iFim > (iIni + 0.04))) || (alto.trilha === baixo.trilha)) { 
var mover = (alto.fim - alto.ini) <= (baixo.fim - baixo.ini) ? alto : baixo;
var ficar = mover === alto ? baixo : alto;
var dur = mover.fim - mover.ini;
var destIni = ficar.ini;
var destFim = destIni + dur;
if (dur > (ficar.fim - ficar.ini)) { 
destFim = ficar.fim;
}
var destino = -1;
for (var t2 = ficar.trilha + 1; t2 < seq.videoTracks.numTracks; t2++) { 
var ocupada = false;
try {
var trc = seq.videoTracks[t2];
for (var q = 0; q < trc.clips.numItems; q += 1) { 
var cq = trc.clips[q];
if ((cq.start.seconds < (destFim - 0.001)) && (cq.end.seconds > (destIni + 0.001))) { 
ocupada = true;
break ;
}}
} catch (eOc2) {ocupada = true;
}
if (!ocupada) { 
destino = t2;
break ;
}}
if (destino < 0) { 
var antes = seq.videoTracks.numTracks;
_fsAddTrilhaVideo(seq);
if (seq.videoTracks.numTracks > antes) { 
destino = seq.videoTracks.numTracks - 1;
trilhaNova = destino;
}
}
if (destino < 0) { 
return _fsJSON.stringify({error: "N\xe3o consegui abrir uma trilha livre pra empilhar o segundo clipe."});
}
var pi = null;
try {
pi = mover.clip.projectItem;
} catch (ePi) {pi = null;
}
if (!pi) { 
return _fsJSON.stringify({error: "N\xe3o consegui ler a m\xeddia do clipe \"" + mover.nome + "\" pra empilhar."});
}
try {
pi.setInPoint(mover.clip.inPoint.seconds, 4);
} catch (eIn) {
}
try {
pi.setOutPoint(mover.clip.outPoint.seconds, 4);
} catch (eOut) {
}
var trDest = null;
try {
trDest = seq.videoTracks[destino];
} catch (eTd) {trDest = null;
}
if (!trDest) { 
return _fsJSON.stringify({error: "A trilha de destino sumiu no meio do empilhamento."});
}
try {
trDest.overwriteClip(pi, String(Math.round(destIni * TPS)));
} catch (eOv) {
}
var copia = _fsTdPedaco(seq, destino, destIni, 0.06);
if (!copia) { 
return _fsJSON.stringify({error: "N\xe3o consegui empilhar o clipe \"" + mover.nome + "\" na trilha V" + destino + 1 + ". Nada foi alterado: ponha um clipe por cima do outro \xe0 m\xe3o e tente de novo."});
}
try {
mover.clip.remove(false, false);
} catch (eRm) {
}
empilhou = 1;
alto = {clip: copia, fim: destFim, ini: destIni, nome: mover.nome, trilha: destino};
baixo = ficar;
iIni = Math.max(alto.ini, baixo.ini);
iFim = Math.min(alto.fim, baixo.fim);
}
if (!(iFim > (iIni + 0.04))) { 
return _fsJSON.stringify({error: "Os dois clipes mal se cruzam no tempo. Deixe um por cima do outro com um trecho em comum."});
}
var tpf = _fsAcTpf(seq);
var disp = _fsAcDisplayFormat(seq);
var cortes = 0;
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (eQ2) {qs = null;
}
var margem = 0.02;
if (alto.ini < (iIni - margem)) { 
_corta(alto.trilha, iIni);
}
if (alto.fim > (iFim + margem)) { 
_corta(alto.trilha, iFim);
}
if (baixo.ini < (iIni - margem)) { 
_corta(baixo.trilha, iIni);
}
if (baixo.fim > (iFim + margem)) { 
_corta(baixo.trilha, iFim);
}
var tolSec = (tpf / TPS) * 1.5;
var pAlto = _fsTdPedaco(seq, alto.trilha, iIni, Math.max(tolSec, 0.06));
var pBaixo = _fsTdPedaco(seq, baixo.trilha, iIni, Math.max(tolSec, 0.06));
if ((!pAlto) || (!pBaixo)) { 
return _fsJSON.stringify({error: "Cortei nas bordas mas n\xe3o reencontrei os dois peda\xe7os pra dividir. Desfa\xe7a (Cmd+Z) e me chame."});
}
var posJanelaY = janela === "baixo" ? 0.77 : 0.23;
var posBaseY = janela === "baixo" ? 0.3 : 0.7;
var midiaBase = _fsTdTamanhoDaMidia(pBaixo);
var mwB = midiaBase ? midiaBase.w : lw;
var mhB = midiaBase ? midiaBase.h : lh;
var ESCALA_BASE = Math.round(Math.max((100 * 0.6 * lh) / mhB, (100 * lw) / mwB) * 10) / 10;
var alvoW = lw;
var alvoH = 0.46 * lh;
var midia = _fsTdTamanhoDaMidia(pAlto);
var mw = midia ? midia.w : lw;
var mh = midia ? midia.h : lh;
var minCrop = 2 + difusao;
var kSobra = 1 - ((2 * minCrop) / 100);
var escJanela = 100 * Math.max(alvoW / (mw * kSobra), alvoH / (mh * kSobra));
var fx = alvoW / ((mw * escJanela) / 100);
var fy = alvoH / ((mh * escJanela) / 100);
var cLR = ((1 - fx) / 2) * 100;
if (cLR < 0) { 
cLR = 0;
}
var cTB = ((1 - fy) / 2) * 100;
if (cTB < 0) { 
cTB = 0;
}
var JANELA_CROP = {base: cTB, direita: cLR, esquerda: cLR, topo: cTB};
var okPos = 0;
var okCrop = 0;
var okEscala = 0;
var okDifusao = 0;
var okRound = 0;
var semCrop = 0;
var semMotion = 0;
var movJ = _fsAchaCompMovimento(pAlto);
if (!movJ) { 
semMotion++;
}
else {
if (_fsTdGrava(_fsTdPropMotion(movJ, "posicao"), [0.5, posJanelaY])) { 
okPos++;
}
_fsTdGrava(_fsTdPropMotion(movJ, "escala"), Math.round(escJanela * 10) / 10);
}
var efJanela = _fsTdAchaEfeitoJanela();
var efJanelaTipo = efJanela.tipo;
var compJanela = _fsTdCompCrop(pAlto);
if (((!compJanela) && (efJanela.eff)) && (qs)) { 
var iniJ = 0;
try {
iniJ = parseFloat(pAlto.start.seconds);
} catch (eIj) {
}
var qeJ = _fsFxQeItem("v", alto.trilha, Math.round(iniJ * TPS), false);
if (qeJ) { 
try {
qeJ.addVideoEffect(efJanela.eff);
} catch (eAj) {
}
compJanela = _fsTdCompCrop(pAlto);
}
}
if (!compJanela) { 
semCrop++;
}
else {
var b = _fsTdBordasCrop(compJanela);
var n2 = 0;
if (_fsTdGrava(b.esquerda, JANELA_CROP.esquerda)) { 
n2++;
}
if (_fsTdGrava(b.topo, JANELA_CROP.topo)) { 
n2++;
}
if (_fsTdGrava(b.direita, JANELA_CROP.direita)) { 
n2++;
}
if (_fsTdGrava(b.base, JANELA_CROP.base)) { 
n2++;
}
if (n2 >= 3) { 
okCrop++;
}
if (difusao > 0) { 
if (_fsTdGrava(b.difusao, difusao)) { 
okDifusao++;
}
}
if (b.roundness) { 
if (_fsTdGrava(b.roundness, 10)) { 
okRound++;
}
}
}
var movB = _fsAchaCompMovimento(pBaixo);
if (!movB) { 
semMotion++;
}
else {
if (_fsTdGrava(_fsTdPropMotion(movB, "posicao"), [0.5, posBaseY])) { 
okPos++;
}
if (_fsTdGrava(_fsTdPropMotion(movB, "escala"), ESCALA_BASE)) { 
okEscala++;
}
}
return _fsJSON.stringify({cortes: cortes, difusao: difusao, dur: iFim - iIni, efeito: efJanelaTipo, empilhou: empilhou, escalaBase: ESCALA_BASE, escalaJanela: Math.round(escJanela * 10) / 10, fim: iFim, ini: iIni, janela: janela, medidas: "janela " + mw + "x" + mh + midia ? "" : " (chute)" + ", base " + mwB + "x" + mhB + midiaBase ? "" : " (chute)" + ", tela " + lw + "x" + lh, midiaLida: midia ? 1 : 0, midiaLidaBase: midiaBase ? 1 : 0, nomeAlto: alto.nome, nomeBaixo: baixo.nome, ok: true, okCrop: okCrop, okDifusao: okDifusao, okEscala: okEscala, okPos: okPos, okRound: okRound, semCrop: semCrop, semMotion: semMotion, trilhaAlto: alto.trilha, trilhaBaixo: baixo.trilha, trilhaNova: trilhaNova});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsTelaDivididaLer() {
try {
function _num(p) {
if (!p) { 
return null;
}
var v = null;
try {
v = p.getValue();
} catch (e) {return null;
}
return typeof v === "number" ? Math.round(v * 10) / 10 : null;
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var sel = _fsTdSelecionados(seq);
if (sel.length !== 1) { 
return _fsJSON.stringify({error: sel.length === 0 ? "Selecione o clipe da JANELA na timeline (s\xf3 ele) e clique em Ler." : sel.length + " clipes selecionados. Pro ajuste manual, selecione s\xf3 o da janela."});
}
var clip = sel[0].clip;
var comp = _fsTdCompCrop(clip);
var posY = null;
var mov = _fsAchaCompMovimento(clip);
if (mov) { 
var pp = _fsTdPropMotion(mov, "posicao");
try {
var pv = pp ? pp.getValue() : null;
if ((pv) && (pv.length === 2)) { 
posY = Math.round(pv[1] * 1000) / 10;
}
} catch (eP) {
}
}
var b = comp ? _fsTdBordasCrop(comp) : {base: null, difusao: null, direita: null, esquerda: null, roundness: null, topo: null};
return _fsJSON.stringify({base: _num(b.base), difusao: _num(b.difusao), direita: _num(b.direita), esquerda: _num(b.esquerda), nome: sel[0].nome, ok: true, posY: posY, roundness: _num(b.roundness), temRecorte: comp ? 1 : 0, topo: _num(b.topo)});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsTelaDivididaAjustar(optsJson) {
try {
function _g(prop, valor) {
if (((valor === null) || (valor === undefined)) || (isNaN(parseFloat(valor)))) { 
return;
}
if (_fsTdGrava(prop, parseFloat(valor))) { 
gravadas++;
}
else {
falhas++;
}
}
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var sel = _fsTdSelecionados(seq);
if (sel.length !== 1) { 
return _fsJSON.stringify({error: sel.length === 0 ? "Selecione o clipe da JANELA na timeline (s\xf3 ele)." : sel.length + " clipes selecionados. Selecione s\xf3 o da janela."});
}
var clip = sel[0].clip;
var comp = _fsTdCompCrop(clip);
if (!comp) { 
var ef = _fsTdAchaEfeitoJanela();
if (ef.eff) { 
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ) {
}
var iniC = 0;
try {
iniC = parseFloat(clip.start.seconds);
} catch (eIc) {
}
var qeC = _fsFxQeItem("v", sel[0].trilha, Math.round(iniC * _fsTdTps()), false);
if (qeC) { 
try {
qeC.addVideoEffect(ef.eff);
} catch (eAc) {
}
comp = _fsTdCompCrop(clip);
}
}
}
if (!comp) { 
return _fsJSON.stringify({error: "N\xe3o consegui aplicar o recorte neste clipe. Rode a divis\xe3o autom\xe1tica primeiro."});
}
var b = _fsTdBordasCrop(comp);
var gravadas = 0;
var falhas = 0;
if (((o.posY !== null) && (o.posY !== undefined)) && (!isNaN(parseFloat(o.posY)))) { 
var mov = _fsAchaCompMovimento(clip);
var pp = mov ? _fsTdPropMotion(mov, "posicao") : null;
var alvoY = parseFloat(o.posY) / 100;
var px = 0.5;
try {
var pv = pp ? pp.getValue() : null;
if ((pv) && (pv.length === 2)) { 
px = pv[0];
}
} catch (eX) {
}
if (_fsTdGrava(pp, [px, alvoY])) { 
gravadas++;
}
else {
falhas++;
}
}
_g(b.esquerda, o.lateral);
_g(b.direita, o.lateral);
_g(b.topo, o.vertical);
_g(b.base, o.vertical);
_g(b.difusao, o.difusao);
var avisoLei = 0;
var dif = parseFloat(o.difusao);
var menorCorte = Math.min(isNaN(parseFloat(o.lateral)) ? 999 : parseFloat(o.lateral), isNaN(parseFloat(o.vertical)) ? 999 : parseFloat(o.vertical));
if ((((!isNaN(dif)) && (dif > 0)) && (menorCorte < 999)) && (dif > menorCorte)) { 
avisoLei = 1;
}
return _fsJSON.stringify({avisoLei: avisoLei, falhas: falhas, gravadas: gravadas, ok: true});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function _fsScExpandeLinhas(srcGroups, order) {
var porKind = {};
for (var i = 0; i < order.length; i += 1) { 
var m = String(order[i]).match(/^L:([a-z]+):(\d+)$/);
if (!m) { 
continue ;
}
var kind = m[1];
var linha = parseInt(m[2], 10);
if ((!porKind[kind]) || (linha > porKind[kind])) { 
porKind[kind] = linha;
}}
for (var kind2 in porKind) { 
var maxL = porKind[kind2];
for (var n = 1; n <= 6; n += 1) { 
var chave = "L:" + kind2 + ":" + n;
if (srcGroups[chave]) { 
continue ;
}
var fonte = null;
for (var q = Math.min(n, maxL); q >= 1; q--) { 
if (srcGroups["L:" + kind2 + ":" + q]) { 
fonte = srcGroups["L:" + kind2 + ":" + q];
break ;
}}
if (!fonte) { 
for (var q2 = n + 1; q2 <= maxL; q2++) { 
if (srcGroups["L:" + kind2 + ":" + q2]) { 
fonte = srcGroups["L:" + kind2 + ":" + q2];
break ;
}}
}
if (!fonte) { 
continue ;
}
srcGroups[chave] = {items: fonte.items, key: chave, name: fonte.name, sintetico: true};
order.push(chave);}
}
}
function fsTrocarCores(optsJson) {
try {
_FS_SC_FERIDOS = [];
var o = null;
try {
o = _fsJSON.parse(optsJson);
} catch (eP) {
}
if (!o) { 
o = {};
}
var corD = _fsScNormColor(String((o.destaque) || ("")));
var corA = _fsScNormColor(String((o.apoio) || ("")));
var corDF = _fsScNormColor(String((o.destaqueFim) || ("")));
var corAF = _fsScNormColor(String((o.apoioFim) || ("")));
if ((((!corD) && (!corA)) && (!corDF)) && (!corAF)) { 
return _fsJSON.stringify({error: "Escolha pelo menos uma cor (destaque ou secund\xe1rio)."});
}
var escopo = o.escopo === "todas" ? "todas" : "selecionadas";
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var alvos = [];
for (var t = 0; t < seq.videoTracks.numTracks; t += 1) { 
var tr = null;
try {
tr = seq.videoTracks[t];
} catch (eT) {continue ;
}
if (!tr) { 
continue ;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
var cl = null;
try {
cl = tr.clips[c];
} catch (eC) {continue ;
}
if (!cl) { 
continue ;
}
var selC = false;
try {
selC = cl.isSelected();
} catch (eS) {
}
if ((escopo !== "todas") && (!selC)) { 
continue ;
}
var mgt = null;
try {
mgt = cl.getMGTComponent();
} catch (eM) {mgt = null;
}
if (mgt) { 
alvos.push(mgt);
}}}
if (!alvos.length) { 
return _fsJSON.stringify({error: escopo === "todas" ? "N\xe3o achei nenhuma legenda (bloco do Frame Speed) na timeline." : "Selecione na timeline a(s) legenda(s) que v\xe3o trocar de cor."});
}
var clipsOk = 0;
var gravadas = 0;
var semCor = 0;
var degrades = 0;
var destaqueGravadas = 0;
var apoioGravadas = 0;
var soUmaLinha = 0;
for (var a = 0; a < alvos.length; a += 1) { 
var leaves = [];
try {
_fsScWalk(alvos[a].properties, [], leaves);
} catch (eW) {continue ;
}
var tamPorLinha = {};
for (var i2 = 0; i2 < leaves.length; i2 += 1) { 
var lf = leaves[i2];
if ((lf.isColor) || (!lf.text)) { 
continue ;
}
var tam = 0;
try {
var ob = _fsJSON.parse(lf.value);
if (((ob) && (ob.fontSizeEditValue)) && (ob.fontSizeEditValue.length)) { 
tam = (Number(ob.fontSizeEditValue[0])) || (0);
}
} catch (eB) {
}
var lin = _fsScLinhaDe(lf);
if ((!tamPorLinha[lin]) || (tam > tamPorLinha[lin])) { 
tamPorLinha[lin] = tam;
}}
var principal = 1;
var maiorTam = -1;
for (var linK in tamPorLinha) { 
var linN = parseInt(linK, 10);
if ((tamPorLinha[linK] > maiorTam) || ((tamPorLinha[linK] === maiorTam) && (linN < principal))) { 
maiorTam = tamPorLinha[linK];
principal = linN;
}
}
var linhasDeCor = {};
for (var i3 = 0; i3 < leaves.length; i3 += 1) { 
var lc = leaves[i3];
if (!lc.isColor) { 
continue ;
}
if (_fsScColorKind(lc.name, lc.groups) !== "text") { 
continue ;
}
linhasDeCor[_fsScLinhaDe(lc)] = 1;}
var nLinhasCor = 0;
for (var lk in linhasDeCor) { 
nLinhasCor++;
}
if (nLinhasCor <= 1) { 
soUmaLinha++;
}
var mexeu = 0;
for (var i4 = 0; i4 < leaves.length; i4 += 1) { 
var lv = leaves[i4];
if ((!lv.isColor) || (!lv.prop)) { 
continue ;
}
var nmV = (lv.name) || ("").toLowerCase();
if (_fsScColorKind(lv.name, lv.groups) !== "text") { 
continue ;
}
var linV = _fsScLinhaDe(lv);
var ehDestaque = (nLinhasCor <= 1) || (linV === principal);
var cor = ehDestaque ? corD : corA;
var ehGrad = (nmV.indexOf("gradient") !== -1) || (nmV.indexOf("ramp") !== -1);
if ((ehGrad) && (nmV.indexOf("end") !== -1)) { 
cor = ehDestaque ? corDF : corAF;
if (!cor) { 
continue ;
}
if (_fsScWriteColor(lv.prop, cor)) { 
gravadas++;
mexeu++;
degrades++;
if (ehDestaque) { 
destaqueGravadas++;
}
else {
apoioGravadas++;
}
}
continue ;
}
if (!cor) { 
continue ;
}
if (_fsScWriteColor(lv.prop, cor)) { 
gravadas++;
mexeu++;
if (ehGrad) { 
degrades++;
}
if (ehDestaque) { 
destaqueGravadas++;
}
else {
apoioGravadas++;
}
}}
if (mexeu > 0) { 
clipsOk++;
}
else {
semCor++;
}}
return _fsJSON.stringify({apoioGravadas: apoioGravadas, clips: alvos.length, clipsOk: clipsOk, degrades: degrades, destaqueGravadas: destaqueGravadas, escopo: escopo, feridos: _FS_SC_FERIDOS, gravadas: gravadas, ok: true, semCor: semCor, soUmaLinha: soUmaLinha});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
function fsConferirFonteAplicada() {
var r = {aplicada: "", esperada: _fsFonteTentada, motivo: "", ok: false};
try {
if (!_fsUltimoMogrt) { 
r.motivo = "sem clipe registrado";
return _fsJSON.stringify(r);
}
if (_fsFonteTentada === "") { 
r.motivo = "modelo nao expoe a fonte";
return _fsJSON.stringify(r);
}
var seq = app.project.activeSequence;
if (!seq) { 
r.motivo = "sem sequencia";
return _fsJSON.stringify(r);
}
var tr = seq.videoTracks[_fsUltimoMogrt.trilha];
if (!tr) { 
r.motivo = "trilha nao achada";
return _fsJSON.stringify(r);
}
var clip = null;
for (var i = 0; i < tr.clips.numItems; i += 1) { 
if (String(tr.clips[i].start.ticks) === String(_fsUltimoMogrt.inicio)) { 
clip = tr.clips[i];
break ;
}}
if (!clip) { 
r.motivo = "clipe nao achado";
return _fsJSON.stringify(r);
}
var mgt = null;
try {
mgt = clip.getMGTComponent();
} catch (eM) {
}
if (!mgt) { 
r.motivo = "sem componente";
return _fsJSON.stringify(r);
}
var props = mgt.properties;
var alvo = String(_fsFonteProp).toLowerCase();
var primeiro = "";
for (var p = 0; p < props.numItems; p += 1) { 
var v = null;
var nome = "";
try {
v = props[p].getValue();
} catch (eV) {
}
try {
nome = String(props[p].displayName).toLowerCase();
} catch (eN) {
}
if (!((typeof v === "string") && (v.indexOf("fontEditValue") !== -1))) { 
continue ;
}
var lido = "";
try {
var o = _fsJSON.parse(v);
if ((o.fontEditValue) && (o.fontEditValue.length)) { 
lido = String(o.fontEditValue[0]);
}
} catch (eP) {
}
if (lido === "") { 
continue ;
}
if (primeiro === "") { 
primeiro = lido;
}
if (nome === alvo) { 
r.aplicada = lido;
break ;
}}
if (r.aplicada === "") { 
r.aplicada = primeiro;
}
if (r.aplicada === "") { 
r.motivo = "nao li a fonte do clipe";
return _fsJSON.stringify(r);
}
r.ok = r.aplicada === r.esperada;
if (!r.ok) { 
r.motivo = "o Premiere manteve outra fonte";
}
} catch (e) {r.motivo = "erro: " + e.toString();
}
return _fsJSON.stringify(r);
}
function fsRetakeSubir(cutsJson, optsJson) {
try {
function _razor(tick) {
var tc = _fsAcTicksToTC(tick, tpf, disp);
for (var v2 = 0; v2 < fl.vN; v2 += 1) { 
if (!vUse[v2]) { 
continue ;
}
try {
qs.getVideoTrackAt(v2).razor(tc);
razors++;
} catch (e1) {
}}
for (var a2 = 0; a2 < fl.aN; a2 += 1) { 
if (!aUse[a2]) { 
continue ;
}
try {
qs.getAudioTrackAt(a2).razor(tc);
razors++;
} catch (e2) {
}}
}
function _dentro(cs, ce) {
for (var k = 0; k < merged.length; k += 1) { 
if ((cs >= (merged[k].s - half)) && (ce <= (merged[k].e + half))) { 
return true;
}}
return false;
}
function _coleta(kind, idx) {
var tr = _fsAcTrack(kind, idx);
if (!tr) { 
return;
}
for (var c = 0; c < tr.clips.numItems; c += 1) { 
try {
var cl = tr.clips[c];
var cs = parseFloat(cl.start.ticks);
var ce = parseFloat(cl.end.ticks);
if (_dentro(cs, ce)) { 
plano.push({e: ce, idx: idx, kind: kind, node: String(cl.nodeId), s: cs});
}
} catch (eP) {
}}
}
function _lista(kind) {
return kind === "v" ? seq.videoTracks : seq.audioTracks;
}
function _livre(kind, tIdx, s, e) {
var tr = null;
try {
tr = _lista(kind)[tIdx];
} catch (eT) {return false;
}
if (!tr) { 
return false;
}
for (var q = 0; q < tr.clips.numItems; q += 1) { 
var cq = tr.clips[q];
var qs2 = parseFloat(cq.start.ticks);
var qe2 = parseFloat(cq.end.ticks);
if ((qs2 < e) && (qe2 > s)) { 
return false;
}}
return true;
}
function _destino(kind, idx, s, e) {
var n = _lista(kind).numTracks;
for (var t = idx + 1; t < n; t++) { 
if (_livre(kind, t, s, e)) { 
return t;
}}
var antes = n;
try {
if (kind === "v") { 
_fsAddTrilhaVideo(seq);
}
else {
_fsAddTrilhaAudio(seq);
}
} catch (eAdd) {
}
var depois = _lista(kind).numTracks;
if (depois > antes) { 
criadas[kind]++;
return depois - 1;
}
return -1;
}
function _totalClipes() {
var tot = 0;
try {
for (var tv = 0; tv < seq.videoTracks.numTracks; tv += 1) { 
tot += seq.videoTracks[tv].clips.numItems;}
} catch (eTv) {
}
try {
for (var ta = 0; ta < seq.audioTracks.numTracks; ta += 1) { 
tot += seq.audioTracks[ta].clips.numItems;}
} catch (eTa) {
}
return tot;
}
function _rot(it) {
return it.kind === "v" ? "V" : "A" + it.idx + 1 + " em " + (Math.round((it.s / TPS) * 100) / 100) + "s";
}
function _chaves(o) {
var arr = [];
for (var kk in o) { 
if (o.hasOwnProperty(kk)) { 
arr.push(kk);
}
}
return arr;
}
var seq = app.project.activeSequence;
if (!seq) { 
return _fsJSON.stringify({error: "Nenhuma sequ\xeancia ativa."});
}
var cuts = null;
var opts = {};
try {
cuts = _fsJSON.parse(cutsJson);
} catch (eC) {cuts = null;
}
try {
opts = optsJson ? _fsJSON.parse(optsJson) : {};
} catch (eO) {opts = {};
}
if ((!cuts) || (!cuts.length)) { 
return _fsJSON.stringify({error: "Nenhum trecho para subir."});
}
var tpf = _fsAcTpf(seq);
var half = Math.floor(tpf / 2);
var disp = _fsAcDisplayFormat(seq);
var merged = _fsAcNormalizeCuts(cuts, tpf, half);
if (!merged.length) { 
return _fsJSON.stringify({error: "Trechos curtos demais (menores que 1 frame)."});
}
try {
if (app.enableQE) { 
app.enableQE();
}
} catch (eQ1) {
}
var qs = null;
try {
qs = qe.project.getActiveSequence();
} catch (eQ2) {qs = null;
}
if (!qs) { 
return _fsJSON.stringify({error: "N\xe3o consegui acessar o motor de corte do Premiere (QE). Reinicie o Premiere e tente de novo \u2014 nada foi alterado na timeline."});
}
var fl = _fsAcTrackFlags(seq);
var vUse = fl.vUse;
var aUse = fl.aUse;
var backupName = "";
var backupId = -1;
if (opts.backup) { 
var origId = -1;
var origName = "";
try {
origId = seq.sequenceID;
} catch (eId) {
}
try {
origName = seq.name;
} catch (eNm) {
}
var seenIds = {};
try {
for (var sb = 0; sb < app.project.sequences.numSequences; sb += 1) { 
try {
seenIds[String(app.project.sequences[sb].sequenceID)] = 1;
} catch (eSb) {
}}
} catch (eEnum) {
}
try {
seq.clone();
} catch (eCl) {
}
try {
for (var sc = 0; sc < app.project.sequences.numSequences; sc += 1) { 
var cs2 = app.project.sequences[sc];
var cid = "";
try {
cid = String(cs2.sequenceID);
} catch (eCid) {continue ;
}
if (!seenIds[cid]) { 
backupId = cid;
var _base = origName ? origName : "Sequ\xeancia";
var _CARIMBOS = [" \u2014 sem corte", " \u2014 antes do AutoCut"];
for (var _c = 0; _c < _CARIMBOS.length; _c += 1) { 
while (_base.indexOf(_CARIMBOS[_c]) !== -1) {
_base = _base.split(_CARIMBOS[_c]).join("");
}}
var wanted = _base + " \u2014 sem corte";
try {
cs2.name = wanted;
} catch (eRn) {
}
try {
if (cs2.projectItem) { 
cs2.projectItem.name = wanted;
}
} catch (eRn2) {
}
try {
backupName = cs2.name;
} catch (eBn) {backupName = wanted;
}
break ;
}}
} catch (eFind) {
}
try {
var act = app.project.activeSequence;
if (((act) && (origId !== -1)) && (act.sequenceID !== origId)) { 
for (var sq = 0; sq < app.project.sequences.numSequences; sq += 1) { 
var cand = app.project.sequences[sq];
if ((cand) && (cand.sequenceID === origId)) { 
app.project.activeSequence = cand;
break ;
}}
}
seq = app.project.activeSequence;
} catch (eAct) {
}
}
var razors = 0;
for (var r = 0; r < merged.length; r += 1) { 
_razor(merged[r].s);
_razor(merged[r].e);}
var plano = [];
for (var a3 = 0; a3 < fl.aN; a3 += 1) { 
if (aUse[a3]) { 
_coleta("a", a3);
}}
for (var v3 = 0; v3 < fl.vN; v3 += 1) { 
if (vUse[v3]) { 
_coleta("v", v3);
}}
if (!plano.length) { 
return _fsJSON.stringify({error: "N\xe3o achei clipe nenhum dentro dos trechos (as trilhas est\xe3o travadas?). Nada foi alterado."});
}
var criadas = {a: 0, v: 0};
var TPS = _FS_AC_TPS;
var subiram = 0;
var falharam = [];
var avisos = [];
var trilhasV = {};
var trilhasA = {};
for (var p = 0; p < plano.length; p += 1) { 
var it = plano[p];
var cl2 = _fsAcFindByNode(it.kind, it.idx, it.node);
if (!cl2) { 
falharam.push(_rot(it) + ": clipe n\xe3o encontrado");
continue ;
}
var pi = null;
try {
pi = cl2.projectItem;
} catch (ePi) {pi = null;
}
if (!pi) { 
falharam.push(_rot(it) + ": sem m\xeddia leg\xedvel");
continue ;
}
var dest = _destino(it.kind, it.idx, it.s, it.e);
if (dest < 0) { 
falharam.push(_rot(it) + ": sem trilha livre acima e n\xe3o consegui criar uma");
continue ;
}
try {
pi.setInPoint(cl2.inPoint.seconds, 4);
} catch (eIn) {
}
try {
pi.setOutPoint(cl2.outPoint.seconds, 4);
} catch (eOut) {
}
var trD = null;
try {
trD = _lista(it.kind)[dest];
} catch (eD) {trD = null;
}
if (!trD) { 
falharam.push(_rot(it) + ": a trilha de destino sumiu");
continue ;
}
var totAntes = _totalClipes();
try {
trD.overwriteClip(pi, String(Math.round(it.s)));
} catch (eOv) {
}
var achou = null;
for (var z = 0; z < trD.clips.numItems; z += 1) { 
var cz = trD.clips[z];
var sz = parseFloat(cz.start.ticks);
if (Math.abs(sz - it.s) < 2) { 
achou = cz;
break ;
}}
if (!achou) { 
falharam.push(_rot(it) + ": a c\xf3pia n\xe3o apareceu na trilha " + it.kind === "v" ? "V" : "A" + dest + 1 + " (original ficou no lugar)");
continue ;
}
var totDepois = _totalClipes();
if (totDepois > (totAntes + 1)) { 
avisos.push(_rot(it) + ": a c\xf3pia trouxe m\xeddia extra em outra trilha (" + ((totDepois - totAntes) - 1) + " clipe(s) a mais)");
}
try {
var ez = parseFloat(achou.end.ticks);
if (ez > (it.e + half)) { 
avisos.push(_rot(it) + ": a c\xf3pia ficou mais longa que o original");
}
} catch (eEz) {
}
try {
cl2.remove(false, false);
} catch (eRm) {falharam.push(_rot(it) + ": copiei pra cima mas n\xe3o consegui tirar o original");
continue ;
}
subiram++;
if (it.kind === "v") { 
trilhasV["V" + dest + 1] = 1;
}
else {
trilhasA["A" + dest + 1] = 1;
}}
return _fsJSON.stringify({avisos: avisos, backup: backupName, backupId: backupId, clipes: plano.length, criadasA: criadas.a, criadasV: criadas.v, falharam: falharam, ok: true, razors: razors, seqId: (function () {
try {
return String(app.project.activeSequence.sequenceID);
} catch (e) {return "";
}
})(), subiram: subiram, trechos: merged.length, trilhasA: _chaves(trilhasA), trilhasV: _chaves(trilhasV)});
} catch (e) {return _fsJSON.stringify({error: e.toString()});
}
}
var FS_HOST_BUILD = "2026-08-28-a";
var _fsJSON = (function () {
function quote(string) {
escapable.lastIndex = 0;
return escapable.test(string) ? "\"" + string.replace(escapable, function (a) {
var c = meta[a];
return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
}) + "\"" : "\"" + string + "\"";
}
function str(key, holder) {
var value = holder[key];
switch (typeof value) { 
case "string":
return quote(value);
case "number":
return isFinite(value) ? String(value) : "null";
case "boolean":
return String(value);
case "object":
if (!value) { 
return "null";
}
partial = [];
if (Object.prototype.toString.apply(value) === "[object Array]") { 
length = value.length;
for (var i = 0; i < length; i += 1) { 
partial[i] = (str(i, value)) || ("null");}
return partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";
}
for (var k in value) { 
if (Object.prototype.hasOwnProperty.call(value, k)) { 
v = str(k, value);
if (v) { 
partial.push(quote(k) + ":" + v);
}
}
}
return partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";
default:
return undefined;
}
}
var escapable = /[\\\"\x00-\x1f]/g;
var meta = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\"};
return {parse: function (text) {
text = String(text);
if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) { 
return eval("(" + text + ")");
}
throw new SyntaxError("_fsJSON.parse: JSON invalido");
}, stringify: function (value) {
return str("", {"": value});
}};
})();
var _fontNamesCache = null;
if ($.os.indexOf("Windows") !== -1) { 
File.prototype.encoding = "UTF-8";
}
if (typeof JSON !== "object") { 
JSON = _fsJSON;
}
var _FS_AC_TPS = 254016000000;
var _FS_AC_VARIANTS = ["moveTicks", "moveSecs", "moveNum", "startAbs", "startEndAbs"];
var _FS_AC_NOOP = 0;
var _FS_AC_PASSO = 20;
var _FS_SC_CAL = null;
var _FS_SC_FERIDOS = [];
var _FS_SC_FONTE = {exemplo: "", ok: 0, pedidas: 0, recusadas: 0, semCampo: 0};
var _FS_SC_CAMPOS_FONTE = ["fontEditValue", "fontFamilyName", "fontStyleName", "fontSizeEditValue", "fontFSBoldValue", "fontFSItalicValue", "fontFauxBoldEditValue", "fontFauxItalicEditValue"];
var _FS_IDIOMA = "";
var _FS_Z_TPS = 254016000000;
var _fsZTfFalha = "";
var _FS_ACENTOS = {"\uffe0": "a", "\uffe1": "a", "\uffe2": "a", "\uffe3": "a", "\uffe4": "a", "\uffe7": "c", "\uffe8": "e", "\uffe9": "e", "\uffea": "e", "\uffeb": "e", "\uffec": "i", "\uffed": "i", "\uffee": "i", "\uffef": "i", "\ufff1": "n", "\ufff2": "o", "\ufff3": "o", "\ufff4": "o", "\ufff5": "o", "\ufff6": "o", "\ufff9": "u", "\ufffa": "u", "\ufffb": "u", "\ufffc": "u"};
var FS_GUIA_MARCA = "AREA SEGURA";
var FS_GUIA_NOME = "\u26a0 " + FS_GUIA_MARCA + " \u2014 REMOVER ANTES DE EXPORTAR";
var FS_GUIA_BIN = "Frame Speed \u2014 guias";
var FS_GUIA_REF = {"169": 1920, "916": 1080};
var _fsUltimoMogrt = null;
var _fsFonteTentada = "";
var _fsFonteProp = "";