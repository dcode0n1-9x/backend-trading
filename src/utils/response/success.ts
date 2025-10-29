class HttpResponse {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) { }

  toResponse() {
    return new Response(
      JSON.stringify({
        status: this.status,
        message: this.message,
        data: this.data  // extra memory sent via the api 
      }),
      {
        status: this.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}


export {
  HttpResponse
}