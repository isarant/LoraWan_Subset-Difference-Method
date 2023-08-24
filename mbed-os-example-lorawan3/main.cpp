#include "mbed.h"
//#include "mbed-memory-status/mbed_memory_status.h"
//#include "events/EventQueue.h"

#include "MultiLora.h"

#include <string>

#if (MBED_CONF_APP_SERIALBLUETOOTH==1)
	#include "SerialBluetooth.h"
#endif//MBED_CONF_APP_SERIALBLUETOOTH




 static  MultiLora *multilora;
#if (MBED_CONF_APP_SERIALBLUETOOTH==1)
 static SerialBluetooth *serialbluetooth;
#endif//MBED_CONF_APP_SERIALBLUETOOTH

EventQueue queue(32 * EVENTS_EVENT_SIZE);
void lorahRXCallback(const string loramessage){
	//queue.call(printf,"lorahRXCallback  %s \n\r",loramessage.c_str());
#if (MBED_CONF_APP_SERIALBLUETOOTH==1)
	//serialbluetooth->send(loramessage);
	queue.call(serialbluetooth,&SerialBluetooth::send,loramessage);
#endif//MBED_CONF_APP_SERIALBLUETOOTH
}

void multilorainit(){
	multilora=new MultiLora(&lorahRXCallback,&queue);
}

void multiloradesc(){
	delete(multilora);
}

#if (MBED_CONF_APP_SERIALBLUETOOTH==1)
void bluetoothRXCallback(const string bluetoothmessage){
	if(bluetoothmessage.compare("hellolora\r\n")==0)
		queue.call(multilora,&MultiLora::sendInfo);

	else if (bluetoothmessage.compare("connectlora\r\n")==0)
		queue.call(multilora,&MultiLora::connect);

	else if (bluetoothmessage.compare("diconnectlora\r\n")==0){
		queue.call(multilora,&MultiLora::disconnect);
		}
	else{
		//queue.call(multilora,&MultiLora::send,(char *)bluetoothmessage);
		queue.call(multilora,&MultiLora::send,bluetoothmessage);
		//multilora->send((char *)tmpmessage);
	}

}
#endif//MBED_CONF_APP_SERIALBLUETOOTH


int main(void)
{
#if (MBED_CONF_APP_SERIALBLUETOOTH==1)
	serialbluetooth=new SerialBluetooth (&bluetoothRXCallback,&queue);
#endif//MBED_CONF_APP_SERIALBLUETOOTH

	multilorainit();
	queue.call(multilora,&MultiLora::connect);


//
//    printf("\n\r************************ Lora Start**********************\n\r");
//			printf("\n\r__________________________Thread_info Start____________________--\n\r");
//			print_all_thread_info();
//			printf("\n\r__________________________Thread_info End____________________--\n\r");
//			printf("\n\r --------------------------Heap ISR Start -----------------------\n\r");
//				print_heap_and_isr_stack_info();
//			printf("\n\r --------------------------Heap ISR End -----------------------\n\r");
//	printf("\n\r************************ Lora End**********************\n\r");


	queue.dispatch_forever();

    return 0;
}

