import { NextFunction, Request, Response } from 'express';

type ErrT = {
  code: string;
  message: string | { [key: string]: string };
  status: number;
};

const lstErr: ErrT[] = [
  {
    code: 'BE001',
    message: {
      es: 'Error interno del servidor',
      en: 'Internal Server Error',
    },
    status: 500,
  },
  {
    code: 'BE002',
    message: {
      es: 'No autorizado',
      en: 'Unauthorized',
    },
    status: 401,
  },
  {
    code: 'BE003',
    message: {
      es: 'Prohibido',
      en: 'Forbidden',
    },
    status: 403,
  },
  {
    code: 'BE004',
    message: {
      es: 'No encontrado',
      en: 'Not Found',
    },
    status: 404,
  },
  {
    code: 'BE005',
    message: {
      es: 'Solicitud incorrecta',
      en: 'Bad Request',
    },
    status: 400,
  },
  {
    code: 'BE010',
    message: {
      es: 'Error consultando la base de datos',
      en: 'Error querying the database',
    },
    status: 500,
  },
  {
    code: 'BE101',
    message: {
      es: 'Revise los datos ingresados',
      en: 'Check the entered data',
    },
    status: 400,
  },
  {
    code: 'BE102',
    message: {
      es: 'El correo electrónico o la contraseña son incorrectos',
      en: 'Email or password are incorrect',
    },
    status: 400,
  },
  {
    code: 'BE103',
    message: {
      es: 'Error al procesar el archivo',
      en: 'Error processing the file',
    },
    status: 400,
  },
  {
    code: 'BE104',
    message: {
      es: 'Solo se permiten archivos .xlsx',
      en: 'Only .xlsx files are allowed',
    },
    status: 400,
  },
];

const langOptions = {
  es: 'es',
  en: 'en',
};

export function errHandler(
  fn: (req: Request, res: Response, next: NextFunction) => void
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err: unknown) {
      req.end();

      const langData = req.headers['accept-language']
        ?.split(',')[0]
        .split('-')[0];
      const lang = langOptions[langData as keyof typeof langOptions] || 'es';

      // eslint-disable-next-line no-console
      console.log(`\n\x1b[41m Error: ${err} \x1b[0m\n`);

      const { code, message, status } =
        lstErr.find((e) => e.code === err) || lstErr[0];

      const isObj = typeof message === 'object';

      return res.status(status).json({
        code,
        message: isObj ? message[lang] : message,
      });
    }
  };
}
