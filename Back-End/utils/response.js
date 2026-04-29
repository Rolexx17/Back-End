export default function sendResponse(res, statusCode, message, data = null, meta = null) {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message: message,
    };
    if (data) response.data = data;
    if (meta) response.meta = meta;
    
    return res.status(statusCode).json(response);
}