# Запуск
```
yarn start:dev
```

# Создание элемента
```
setSelectable(element, config)
```
где element - wrapper для виджета, config содержит в т.ч. downloader

# Пример использования
```
const select = setSelectable(window.document.getElementById('select-wrapper'), {
    queryInput: {
        debounceDelay: 400,
        minInputLength: 2,
    },
    selectedList: {
        removeText: '',
    },
    downloader: {
        type: 'fetch',
        urlMapper: (input) => `https://api.hh.ru/suggests/areas?text=${input}`,
        resultMapper: (data) => data.items,
    },
});
select.onChange(console.log);
```

# Сущности
* DownloaderMachine
Источник данных. Может использовать как локальные данные (type='local'), так и делать вызов к удаленному источнику (type='fetch').

Для type='fetch' требуется предоставление urlMapper для составления url для доступа к удаленному ресурсу по введенным данным и resultMapper для транформации полученных данных в требуемый для SelectMachine вид.

* SelectView 
Отображает кастомный селект с полем ввода. Позволяет подписываться на события ввода текста, выбора новой позиции. Хранит текущую выделенную позицию.

* List
Отображает список выбранных позиций, позволяет удалять их и подписываться на событие удаления

* SelectMachine
Управляет поведением SelectView, List, хранит выбранные элементы, связывает передачу данных из SelectView в Downloader и обратно.