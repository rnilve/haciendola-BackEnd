import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`Server: \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
