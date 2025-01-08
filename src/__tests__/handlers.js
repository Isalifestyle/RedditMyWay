import { rest } from 'msw';

export const handlers = [
    rest.get('https://www.reddit.com/r/popular.json?raw_json=1', (req, res, ctx) => {
        console.log('Mocking API request');

        return res(
            ctx.status(200),
            ctx.json({
                data: {
                    children: [
                        { data: { id: '1', title: 'Post 1', author: 'user1'}},
                        { data: {id: 2, title: 'Post 2', author: 'user2'}}
                    ]
                }
            })
          );
       }   
    )
]