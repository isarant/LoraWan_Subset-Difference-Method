
#ifndef MBED_OS_MULTILORA_H_
#define MBED_OS_MULTILORA_H_

#include "mbed.h"
//#include "events/EventQueue.h"
#include "lorawan/LoRaWANInterface.h"
#include "lorawan/system/lorawan_data_structures.h"
#include "LoRaMac.h"
#include <string>

#if (MBED_CONF_APP_LLNMULTICAST==1)
	#ifndef NNLDECRYPT_H2_
		#include "NNLDecrypt.h"
	#endif
#endif//MBED_CONF_APP_LLNMULTICAST

#define CONFIRMED_MSG_RETRY_COUNTER 3
#define TX_TIMER                    10000
#define BUFFER_SIZE					242
#define SX1272   					0xFF
#define SX1276   					0xEE



//using namespace events;

using namespace std;

class MultiLora {
public:
	MultiLora(Callback <void(const string)> recieve_cb,EventQueue *queue);
	virtual ~MultiLora();
    void send (string message) ;
    int init();
    void sendInfo();
	int tryconnect();
	void disconnect();
	void connect();
	bool isConnected=false;
	bool enableMultichannel=false;
protected:
	Callback <void(const string)> recieve_callback;
	lorawan_app_callbacks_t callbacks;
    EventQueue *ev_queue;
private:
    bool lowan_init=false;
    int classType=0; //0 Class A , 1 Class B , 2 Class C
	void send_message(string message);
	void sendToCallBackRecievedString(const uint8_t *message,bool withAdditions);
	void sendToCallBackRecievedString( uint8_t *message);
	void lora_event_handler(lorawan_event_t event);
	void multi();
	void LoRa_PrintChannels();
	void class_c();
	void receive_message();
	int cur_DR=DR_0;
#if (MBED_CONF_APP_LLNMULTICAST==1)
	uint8_t *inbuffer;
	int subsetnum=0;
	int countframe=0;
	int maxframecount=0;
	int index_inbuffer=-1;
#endif//MBED_CONF_APP_LLNMULTICAST

};

#endif /* MBED_OS_MULTILORA_H_ */
