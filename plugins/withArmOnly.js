// Собираем APK только под ARM-телефоны (armeabi-v7a, arm64-v8a): без x86-эмуляторных библиотек APK заметно меньше.
const { withGradleProperties } = require('expo/config-plugins');

module.exports = function withArmOnly(config) {
  return withGradleProperties(config, (c) => {
    c.modResults = c.modResults.filter((p) => !(p.type === 'property' && p.key === 'reactNativeArchitectures'));
    c.modResults.push({ type: 'property', key: 'reactNativeArchitectures', value: 'armeabi-v7a,arm64-v8a' });
    return c;
  });
};
