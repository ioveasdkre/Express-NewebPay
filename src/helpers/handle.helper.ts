import { Response } from 'express';


function handleResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) {
  res.status(statusCode);

  if (data) {
    res.json({
      statusCode,
      message,
      data,
    });
  } else {
    res.json({
      statusCode,
      message,
    });
  }
}

function missingFieldErrorMessage(fieldName: string) {
  return `${fieldName}必填欄位未填寫`;
}

export { handleResponse, missingFieldErrorMessage };
