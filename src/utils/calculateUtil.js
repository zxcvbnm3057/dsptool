export function unitsConversion(number, globalSetting) {
    return number * (globalSetting.unitInSecond ? 1 : 60);
}

export function roundToFix2(number) {
    return Math.round(number * 100) / 100
}