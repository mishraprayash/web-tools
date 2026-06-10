export type HttpStatus = {
  code: number;
  message: string;
  category: string;
  description: string;
};

export const httpStatusCodes: HttpStatus[] = [
  { code: 100, message: "Continue", category: "1xx Informational", description: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, message: "Switching Protocols", category: "1xx Informational", description: "The requester has asked the server to switch protocols and the server has agreed to do so." },
  { code: 102, message: "Processing", category: "1xx Informational", description: "A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request." },
  { code: 103, message: "Early Hints", category: "1xx Informational", description: "Used to return some response headers before final HTTP message." },
  
  { code: 200, message: "OK", category: "2xx Success", description: "Standard response for successful HTTP requests." },
  { code: 201, message: "Created", category: "2xx Success", description: "The request has been fulfilled, resulting in the creation of a new resource." },
  { code: 202, message: "Accepted", category: "2xx Success", description: "The request has been accepted for processing, but the processing has not been completed." },
  { code: 203, message: "Non-Authoritative Information", category: "2xx Success", description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response." },
  { code: 204, message: "No Content", category: "2xx Success", description: "The server successfully processed the request and is not returning any content." },
  { code: 205, message: "Reset Content", category: "2xx Success", description: "The server successfully processed the request, but is not returning any content. The client should reset the document view." },
  { code: 206, message: "Partial Content", category: "2xx Success", description: "The server is delivering only part of the resource due to a range header sent by the client." },
  { code: 207, message: "Multi-Status", category: "2xx Success", description: "The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made." },
  { code: 208, message: "Already Reported", category: "2xx Success", description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again." },
  { code: 226, message: "IM Used", category: "2xx Success", description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance." },
  
  { code: 300, message: "Multiple Choices", category: "3xx Redirection", description: "Indicates multiple options for the resource from which the client may choose." },
  { code: 301, message: "Moved Permanently", category: "3xx Redirection", description: "This and all future requests should be directed to the given URI." },
  { code: 302, message: "Found", category: "3xx Redirection", description: "Tells the client to look at (browse to) another URL. 302 has been superseded by 303 and 307." },
  { code: 303, message: "See Other", category: "3xx Redirection", description: "The response to the request can be found under another URI using the GET method." },
  { code: 304, message: "Not Modified", category: "3xx Redirection", description: "Indicates that the resource has not been modified since the version specified by the request headers." },
  { code: 305, message: "Use Proxy", category: "3xx Redirection", description: "The requested resource is available only through a proxy, the address for which is provided in the response." },
  { code: 307, message: "Temporary Redirect", category: "3xx Redirection", description: "In this case, the request should be repeated with another URI; however, future requests should still use the original URI." },
  { code: 308, message: "Permanent Redirect", category: "3xx Redirection", description: "The request and all future requests should be repeated using another URI." },
  
  { code: 400, message: "Bad Request", category: "4xx Client Error", description: "The server cannot or will not process the request due to an apparent client error." },
  { code: 401, message: "Unauthorized", category: "4xx Client Error", description: "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided." },
  { code: 402, message: "Payment Required", category: "4xx Client Error", description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme." },
  { code: 403, message: "Forbidden", category: "4xx Client Error", description: "The request contained valid data and was understood by the server, but the server is refusing action." },
  { code: 404, message: "Not Found", category: "4xx Client Error", description: "The requested resource could not be found but may be available in the future." },
  { code: 405, message: "Method Not Allowed", category: "4xx Client Error", description: "A request method is not supported for the requested resource." },
  { code: 406, message: "Not Acceptable", category: "4xx Client Error", description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request." },
  { code: 407, message: "Proxy Authentication Required", category: "4xx Client Error", description: "The client must first authenticate itself with the proxy." },
  { code: 408, message: "Request Timeout", category: "4xx Client Error", description: "The server timed out waiting for the request." },
  { code: 409, message: "Conflict", category: "4xx Client Error", description: "Indicates that the request could not be processed because of conflict in the current state of the resource." },
  { code: 410, message: "Gone", category: "4xx Client Error", description: "Indicates that the resource requested is no longer available and will not be available again." },
  { code: 411, message: "Length Required", category: "4xx Client Error", description: "The request did not specify the length of its content, which is required by the requested resource." },
  { code: 412, message: "Precondition Failed", category: "4xx Client Error", description: "The server does not meet one of the preconditions that the requester put on the request header fields." },
  { code: 413, message: "Payload Too Large", category: "4xx Client Error", description: "The request is larger than the server is willing or able to process." },
  { code: 414, message: "URI Too Long", category: "4xx Client Error", description: "The URI provided was too long for the server to process." },
  { code: 415, message: "Unsupported Media Type", category: "4xx Client Error", description: "The request entity has a media type which the server or resource does not support." },
  { code: 416, message: "Range Not Satisfiable", category: "4xx Client Error", description: "The client has asked for a portion of the file, but the server cannot supply that portion." },
  { code: 417, message: "Expectation Failed", category: "4xx Client Error", description: "The server cannot meet the requirements of the Expect request-header field." },
  { code: 418, message: "I'm a teapot", category: "4xx Client Error", description: "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol." },
  { code: 421, message: "Misdirected Request", category: "4xx Client Error", description: "The request was directed at a server that is not able to produce a response." },
  { code: 422, message: "Unprocessable Entity", category: "4xx Client Error", description: "The request was well-formed but was unable to be followed due to semantic errors." },
  { code: 423, message: "Locked", category: "4xx Client Error", description: "The resource that is being accessed is locked." },
  { code: 424, message: "Failed Dependency", category: "4xx Client Error", description: "The request failed because it depended on another request and that request failed." },
  { code: 425, message: "Too Early", category: "4xx Client Error", description: "Indicates that the server is unwilling to risk processing a request that might be replayed." },
  { code: 426, message: "Upgrade Required", category: "4xx Client Error", description: "The client should switch to a different protocol such as TLS/1.3, given in the Upgrade header field." },
  { code: 428, message: "Precondition Required", category: "4xx Client Error", description: "The origin server requires the request to be conditional." },
  { code: 429, message: "Too Many Requests", category: "4xx Client Error", description: "The user has sent too many requests in a given amount of time." },
  { code: 431, message: "Request Header Fields Too Large", category: "4xx Client Error", description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large." },
  { code: 451, message: "Unavailable For Legal Reasons", category: "4xx Client Error", description: "A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource." },
  
  { code: 500, message: "Internal Server Error", category: "5xx Server Error", description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable." },
  { code: 501, message: "Not Implemented", category: "5xx Server Error", description: "The server either does not recognize the request method, or it lacks the ability to fulfil the request." },
  { code: 502, message: "Bad Gateway", category: "5xx Server Error", description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server." },
  { code: 503, message: "Service Unavailable", category: "5xx Server Error", description: "The server cannot handle the request (because it is overloaded or down for maintenance)." },
  { code: 504, message: "Gateway Timeout", category: "5xx Server Error", description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server." },
  { code: 505, message: "HTTP Version Not Supported", category: "5xx Server Error", description: "The server does not support the HTTP protocol version used in the request." },
  { code: 506, message: "Variant Also Negotiates", category: "5xx Server Error", description: "Transparent content negotiation for the request results in a circular reference." },
  { code: 507, message: "Insufficient Storage", category: "5xx Server Error", description: "The server is unable to store the representation needed to complete the request." },
  { code: 508, message: "Loop Detected", category: "5xx Server Error", description: "The server detected an infinite loop while processing the request." },
  { code: 510, message: "Not Extended", category: "5xx Server Error", description: "Further extensions to the request are required for the server to fulfil it." },
  { code: 511, message: "Network Authentication Required", category: "5xx Server Error", description: "The client needs to authenticate to gain network access." },
];

export function searchHttpStatus(query: string): HttpStatus[] {
  const lowercaseQuery = query.toLowerCase();
  return httpStatusCodes.filter(status => 
    status.code.toString().includes(lowercaseQuery) ||
    status.message.toLowerCase().includes(lowercaseQuery) ||
    status.description.toLowerCase().includes(lowercaseQuery)
  );
}
