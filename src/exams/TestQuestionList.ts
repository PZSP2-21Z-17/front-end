import Question from "../questions/Question";

export const TestQuestionList: Question[] = [
    {
        id: 1,
        contents: 'Zażółć gęślą jaźń?',
        answers: [
            {
                id: 1,
                content: 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.',
                isCorrect: false
            },
            {
                id: 2,
                content: 'Mężny bądź, chroń pułk twój i sześć flag.',
                isCorrect: false
            },
            {
                id: 3,
                content: 'Myślę: Fruń z płacht gąsko, jedź wbić nóż.',
                isCorrect: true
            }
        ]
    },
    {
        id: 2,
        contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate tortor in urna scelerisque ornare. Praesent sit amet augue odio. Ut dapibus quam malesuada elit pellentesque, non pretium nibh laoreet. Donec tristique aliquet enim, eu egestas ante consectetur sit amet. Aenean imperdiet nibh ac magna imperdiet elementum. Nunc porta tortor lacus, in auctor dolor pretium vitae. Quisque semper metus finibus vehicula tincidunt. Duis malesuada arcu ut arcu consectetur varius. Nulla blandit orci at interdum malesuada. Donec imperdiet vel magna quis vestibulum. Aenean mi sem, dictum nec risus nec, ultricies tristique magna. Pellentesque tortor orci, mattis quis interdum vitae, placerat quis dui?',
        answers: [
            {
                id: 1,
                content: 'Sed maximus imperdiet auctor. Morbi pulvinar diam a nisi porta convallis. Pellentesque interdum velit purus, quis volutpat velit sollicitudin maximus. Nunc et fringilla erat. Cras congue scelerisque justo eget commodo. Aenean hendrerit ullamcorper sodales. Cras placerat venenatis risus, a lobortis quam vulputate non. Quisque imperdiet sem felis, a fermentum est tincidunt at. Sed ac sodales quam, sit amet auctor libero. Nullam non magna cursus, gravida erat at, ultricies augue. Donec at felis at leo commodo bibendum.',
                isCorrect: true
            },
            {
                id: 2,
                content: 'Vivamus ac nisl et mauris consectetur fringilla. In cursus, magna nec ultricies sollicitudin, augue odio iaculis odio, non porta nisl arcu quis sem. Proin eu luctus mauris. Ut nisi orci, luctus eu commodo in, luctus vitae lacus. Aenean at consectetur purus. Phasellus sit amet venenatis lectus. Cras sit amet urna tincidunt, tempor nunc id, feugiat ipsum. Phasellus commodo volutpat arcu sed viverra. Suspendisse nisi orci, sollicitudin nec massa a, pharetra fermentum orci. Vestibulum molestie ante non diam congue, sit amet tempus nulla venenatis. Nunc venenatis tortor ut nibh sagittis tempus.',
                isCorrect: false
            }
        ]
    },
    {
        id: 3,
        contents: 'Co wypisze na ekran polecenie `print(5)` w języku Python 3?',
        answers: [
            {
                id: 1,
                content: '`owca`',
                isCorrect: false
            },
            {
                id: 2,
                content: '`lama`',
                isCorrect: false
            },
            {
                id: 3,
                content: '5',
                isCorrect: true
            },
            {
                id: 4,
                content: '\\(E=mc^{2}\\)',
                isCorrect: false
            }
        ]
    },
    {
        id: 4,
        contents: 'To pytanie to zarzutka',
        answers: [
            {
                id: 1,
                content: 'a',
                isCorrect: false
            },
            {
                id: 2,
                content: 'ok',
                isCorrect: false
            },
            {
                id: 3,
                content: 'łapię',
                isCorrect: false
            },
            {
                id: 4,
                content: 'niedobrze',
                isCorrect: false
            }
        ]
    },
    {
        id: 5,
        contents: 'Answer **answer** *answer* ~~answer~~ __answer__... How to find the answer?',
        answers: [
            {
                id: 1,
                content: '[StackOverflow](https://stackoverflow.com/)',
                isCorrect: false
            },
            {
                id: 2,
                content: '[Let Me Google That For You](http://lmgtfy.com/)',
                isCorrect: false
            },
            {
                id: 3,
                content: '`/dev/null`',
                isCorrect: false
            },
            {
                id: 4,
                content: 'Nowhere.',
                isCorrect: false
            }
        ]
    },
    {
        id: 6,
        contents: 'Jaki będzie efekt przekroczenia długości strony?',
        answers: [
            {
                id: 1,
                content: '```js\nconsole.log(\'Wszyscy zginiemy\')\n```',
                isCorrect: true
            },
            {
                id: 2,
                content: 'Tekst zostanie ucięty w połowie.',
                isCorrect: true
            },
            {
                id: 3,
                content: 'Tego nawet najstarsi linuksiarze nie wiedzą.',
                isCorrect: true
            },
            {
                id: 4,
                content: '\\[\\int_{-\\infty}^{+\\infty}x^{3}dx\\]',
                isCorrect: true
            }
        ]
    }
];

export default TestQuestionList;
