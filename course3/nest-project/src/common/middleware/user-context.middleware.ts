import { NextFunction, Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    id: string | null;
    role: 'quest' | 'user' | 'admin';
  };
}

export function UserContextMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const userId = req.headers['x-user-id'] as string | undefined;

  const userRole =
    (req.headers['x-user-role'] as string | undefined) || 'quest';

  req.user = {
    id: userId ?? null,
    role: (['user', 'admin'].includes(userRole) ? userRole : 'quest') as
      | 'quest'
      | 'user'
      | 'admin',
  };

  next();
}
