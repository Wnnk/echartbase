import type { ECOption } from "@/hooks/useEchart";

let eventSource: EventSource | null = null;
let isConnected = false;




export const openSSE = async (url: string) => {
  if(eventSource) {
    console.log('eventSource is already open');
    return;
  }
  eventSource = new EventSource(url);
  isConnected = true;
 
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
  }


 

  

  eventSource.onerror = (event) => {
    console.log('EventSource error', event);
    eventSource?.close();
    eventSource = null;
    isConnected = false;
  }
}

export const closeSSE = () => {
  if(eventSource) {
    eventSource.close();
    eventSource = null;
    isConnected = false;
    console.log('eventSource closed');
  }
}