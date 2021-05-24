var ghpages = require('gh-pages');

ghpages.publish(
    '', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/ketorg0z/ketorg0z.github.io.git', // Update to point to your repository  
        user: {
            name: 'ketorg0z', // update to use your name
            email: 'lev.savolskyy@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)