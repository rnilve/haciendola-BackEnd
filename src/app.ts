import path from 'path';
import cors from 'cors';
import express from 'express';



import welcomeRoutes from './welcome';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import base from './middlewares/base.midd';

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.use(base);

app.use('/', welcomeRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

export default app;
