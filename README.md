# ПолЦены Маркет — мобильное приложение

Expo (React Native) приложение сети магазинов **ПолЦены Маркет**: товары с маркетплейсов со скидкой −50% в Краснодарском крае и Республике Адыгея.

Сайт: [polcenimarket.ru](https://polcenimarket.ru)

## Возможности

- Главная: hero −50%, категории, переход к магазинам, канал MAX сети
- Магазины: поиск, фильтр по городам, «Рядом со мной» (геолокация + haversine)
- Карточка магазина: фото, часы работы, **только чаты этого магазина** (Telegram / MAX) и карта
- Как −50%: штрихкод → цена Ozon / без штрихкода → фото на Wildberries
- Ещё: сайт, канал MAX, описание сети (14 магазинов)

## Требования

- Node.js 20.19+ (рекомендуется)
- npm
- [Expo Go](https://expo.dev/go) на телефоне (для быстрой проверки)
- Для нативных сборок: аккаунт Expo и [EAS CLI](https://docs.expo.dev/build/setup/)

## Установка

```bash
cd polcenimarket-app
npm install
```

## Запуск в Expo Go

```bash
npx expo start
```

Отсканируйте QR-код в приложении Expo Go (Android) или камерой (iOS).

Альтернативы:

```bash
npm start
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Проверка TypeScript

```bash
npm run typecheck
# или
npx tsc --noEmit
```

## Сборка APK / iOS через EAS

1. Установите EAS CLI и войдите:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

2. Укажите реальный `extra.eas.projectId` в `app.json` (создаётся командой `eas init` / `eas build:configure`).

3. Android APK (внутренняя раздача):

```bash
eas build -p android --profile preview
```

4. Production Android (AAB) / iOS:

```bash
eas build -p android --profile production
eas build -p ios --profile production
```

Идентификаторы пакета:

- iOS: `ru.polcenimarket.app`
- Android: `ru.polcenimarket.app`

## Публикация в GitHub

Репозиторий: https://github.com/020alex2229-dotcom/polcenimarket-app

```bash
cd polcenimarket-app
git init
git add .
git commit -m "Initial Expo app ПолЦены Маркет"
git branch -M main
git remote add origin https://github.com/020alex2229-dotcom/polcenimarket-app.git
git push -u origin main
```

Если репозиторий уже не пустой — сначала сделайте `git pull --rebase origin main` или форс-пуш только если уверены.

## Структура

```
app/
  (tabs)/          # Главная, Магазины, −50%, Ещё
  store/[id].tsx   # Детали магазина
src/
  data/stores.ts   # 14 магазинов и ссылки на чаты
  components/      # StoreCard
  utils/           # geo (haversine), hours
constants/Colors.ts
```

## Важно про чаты

У каждого магазина свои ссылки Telegram и MAX. В карточке и на экране деталей открываются **только** ссылки выбранного магазина — чаты разных точек не смешиваются.

## Бренд

- Крем `#FBF6EE`
- Чернила `#182130`
- Янтарь `#E7A11B` / `#B77E0A`
- Синий `#1D3A6E`
- Telegram `#229ED9`
