export interface ErrorContext {
  userId?: string
  userEmail?: string
  component?: string
  action?: string
  additionalData?: Record<string, any>
}

export interface ErrorLog {
  id: string
  message: string
  stack?: string
  level: 'error' | 'warning' | 'info'
  timestamp: string
  url: string
  userAgent: string
  context?: ErrorContext
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100

  logError(error: Error | string, context?: ErrorContext, level: 'error' | 'warning' | 'info' = 'error') {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      level,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      context
    }

    this.logs.push(errorLog)
    this.trimLogs()

    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog)
    }

    return errorLog.id
  }

  logApiError(endpoint: string, status: number, response: any, context?: ErrorContext) {
    const error = `API Error: ${endpoint} returned ${status}`
    this.logError(error, {
      ...context,
      additionalData: {
        endpoint,
        status,
        response: typeof response === 'string' ? response : JSON.stringify(response)
      }
    })
  }

  logUserAction(action: string, data?: any, context?: ErrorContext) {
    this.logError(`User Action: ${action}`, {
      ...context,
      action,
      additionalData: data
    }, 'info')
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }
}

export const errorLogger = new ErrorLogger()

export const logError = (error: Error | string, context?: ErrorContext) => 
  errorLogger.logError(error, context)

export const logApiError = (endpoint: string, status: number, response: any, context?: ErrorContext) => 
  errorLogger.logApiError(endpoint, status, response, context)

export const logUserAction = (action: string, data?: any, context?: ErrorContext) => 
  errorLogger.logUserAction(action, data, context)