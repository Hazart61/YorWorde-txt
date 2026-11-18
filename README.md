# YorWorde-txt

Всем здрасте! Это мой проект - приложение для создания своих словарей
и изучения новых слов.

Пока всё делается хз будет ли ИИ и сервера для платформы,
но это есть в идее.

Дальше для меня, но вы тоже можете чекнуть проект в Figma:

🔗 [Открыть макет в Figma](https://www.figma.com/design/Du7Kz9RR3EahdGWWUVjH1g/proect2?node-id=37-3&t=EOmNUlfvfIQwMQof-0)

## Установка и запуск

Для работы необходимо дополнительно установить среду **Node.js**:

🔗 https://nodejs.org/en/download

Далее выполнить команды:

```bash
npm install -g expo-cli
cd YorWorde-txt
npm start --clear
```

## Архитектура (MVVM)

```
App.js                      — точка входа: тема, навигация, запуск через useAppViewModel
src/
├── models/                 — Model: сущности и состояния
│   ├── Dictionary.js, Word.js, User.js, Character.js
│   └── LoadState.js        — Status: idle / loading / success / error
├── data/                   — Data / Repository
│   ├── local/              — источники: SQLite (database.js), AsyncStorage
│   ├── remote/             — источник: Rick and Morty API
│   └── repositories/       — Auth, Dictionary, Word, Profile, Character, Settings
├── viewmodels/             — ViewModel: хуки состояния экранов
│   ├── useLoadable.js      — общий хук Loading / Success / Error
│   └── use<Экран>ViewModel.js
├── views/                  — View
│   ├── screens/            — экраны: только UI, Alert и навигация
│   └── components/         — BottomNav, LoadingView, ErrorView
└── theme/                  — цвета и ThemeContext
```

Поток данных: **View → ViewModel → Repository → источник данных (SQLite / AsyncStorage / сеть)**.
View не знает, откуда берутся данные. ViewModel не знает про навигацию и Alert:
действия возвращают результат `{ ok, value, error }`, и View сама решает, что показать.

Тесты: `npm test` (ViewModel, репозитории и экран входа).
