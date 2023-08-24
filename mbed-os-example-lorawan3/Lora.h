#ifndef MBED_OS_LORA_H_
#define MBED_OS_LORA_H_

//#include "events/EventQueue.h"
#include "lorawan/LoRaWANInterface.h"
#include "lorawan/system/lorawan_data_structures.h"
#include "LoRaMac.h"
#include "lorawan/LoRaRadio.h"
#include "lora_radio_helper.h"


#define CONFIRMED_MSG_RETRY_COUNTER 3
#define TX_TIMER                    10000
#define BUFFER_SIZE					150

//using namespace events;
using namespace std;
uint8_t NWK_SKEY1[]={0xe7,0x8a,0x62,0xc2,0x50,0xff,0xa9,0x9d,0x40,0x07,0xb2,0x6a,0xd3,0x98,0xcc,0xee};
uint8_t APP_SKEY1[]={0x99,0xd1,0xac,0x0e,0xaa,0xb9,0x77,0xf5,0xe1,0x5e,0x91,0x0d,0x56,0xc5,0x45,0xf1};
loramac_channel_t ttnChannels[] = {
		        {3, {867100000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {4, {867300000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {5, {867500000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {6, {867700000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {7, {867900000, 0, {(DR_5 << 4) | DR_0}, 0}}
		};

uint8_t tx_buffer[BUFFER_SIZE];
uint8_t rx_buffer[BUFFER_SIZE];


static LoRaWANInterface lorawan(radio);
static lorawan_app_callbacks_t callbacks;
static EventQueue ev_queue(32 *EVENTS_EVENT_SIZE);
static void lora_event_handler(lorawan_event_t event);

Callback <void(char*,int)> recieve_callback;


void printhex(char *str, uint8_t *ar,int size);
int Lora_init();
void your_link_check_response(uint8_t demod_margin, uint8_t num_gw);
//int tryconnect();
//void send_message(const char *message);
//void  LoRa_PrintChannels();
//void  receive_message();
//void  class_s();

int Lora_init(){
			// stores the status of a call to LoRaWAN protocol
		lorawan_status_t retcode;
	    // Initialize LoRaWAN stack
	    if (lorawan.initialize(&ev_queue) != LORAWAN_STATUS_OK) {
	        printf("\r\n LoRa initialization failed! \r\n");
	        return -1;
	    }
	    printf("\r\n Mbed LoRaWANStack initialized \r\n");


	    // prepare application callbacks
	    callbacks.events = mbed::callback(lora_event_handler);
	    //lorawan.add_app_callbacks(&callbacks);

	//    callbacks.link_check_resp = mbed::callback(&your_link_check_response);
	    lorawan.add_app_callbacks(&callbacks);

	  //  if (lorawan.add_link_check_request()!= LORAWAN_STATUS_OK)
	  // 	    printf("\r\n add_link_check_request failed! \r\n\r\n");
	 //   else
	 //   	printf("\r\n Cadd_link_check_request success\r\n");

	   //	if (lorawan.cancel_sending()!= LORAWAN_STATUS_OK)
	   //	    printf("\r\n cancel_sending failed! \r\n\r\n");
	   //	else
	   	//	printf("\r\n cancel_sending success\r\n");

	   	 // Set number of retries in case of CONFIRMED messages
	    if (lorawan.set_confirmed_msg_retries(CONFIRMED_MSG_RETRY_COUNTER)!= LORAWAN_STATUS_OK) {
	        printf("\r\n set_confirmed_msg_retries failed! \r\n\r\n");
	        return -1;
	    }

	    printf("\r\n CONFIRMED message retries : %d \r\n",CONFIRMED_MSG_RETRY_COUNTER);

	    // Enable adaptive data rate
	    if (lorawan.enable_adaptive_datarate() != LORAWAN_STATUS_OK) {
	        printf("\r\n enable_adaptive_datarate failed! \r\n");
	        return -1;
	    }

	    printf("\r\n Adaptive data  rate (ADR) - Enabled \r\n");

		//this->multi();

	    retcode = lorawan.connect();

	        if (retcode == LORAWAN_STATUS_OK ||
	                retcode == LORAWAN_STATUS_CONNECT_IN_PROGRESS) {
	        } else {
	            printf("\r\n Connection error, code = %d \r\n", retcode);
	            return -1;
	        }

	        printf("\r\n Connection - In Progress ...\r\n");

}

void printhex(char *str, uint8_t *ar,int size){
	printf(" %s ",str);
	for(int x=0;x<size;x++)
		printf(" %02X ",ar[x]);
	printf("\n\r");
}

void your_link_check_response(uint8_t demod_margin, uint8_t num_gw)
{
	printf("demod_margin:  %d the number of gateways involved in the path %d ", demod_margin,num_gw);//demod_margin is the demodulation margin
	// num_gw represents the number of gateways involved in the path
}

int tryconnect(){
	uint8_t eui[]=MBED_CONF_LORA_APPLICATION_EUI;
		uint8_t key[]=MBED_CONF_LORA_APPLICATION_KEY;
		uint8_t dev[]=MBED_CONF_LORA_DEVICE_EUI;
		printhex("MBED_CONF_LORA_APPLICATION_EUI",eui,16);
		printhex("MBED_CONF_LORA_APPLICATION_KEY",key,16);
		printhex("MBED_CONF_LORA_DEVICE_EUI",dev,8);

		lorawan_status_t retcode=lorawan.connect();

		    if ( retcode== LORAWAN_STATUS_OK || retcode == LORAWAN_STATUS_CONNECT_IN_PROGRESS) {
		    	printf("\r\n Try Connected! %d \r\n",retcode);
		    	return 0;

		    } else {
		    	printf("\r\n Not Connected %d \r\n",retcode);
		    //	 ev_queue->call_in(10000, this,&MultiLora::tryconnect);
		    	return -1;
		    }
}

static void lora_event_handler(lorawan_event_t event)
{
		printf("lora_event_handler");
		switch (event) {
	        case CONNECTED:
	            printf("\r\n Connection - Successful \r\n");
	           //  multi();
	           // class_s();
	           // send_message("test");
	           // recieve_callback("Connected/n/r",3);
	           //  LoRa_PrintChannels();
	            break;
	        case DISCONNECTED:
	            ev_queue.break_dispatch();
	            printf("\r\n Disconnected Successfully \r\n");
	            // recieve_callback("Disconnected/n/r",4);
	            break;
	        case TX_DONE:
	            printf("\r\n Message Sent to Network Server \r\n");
	  //          if (MBED_CONF_LORA_DUTY_CYCLE_ON) {
	//                send_message();
	  //          }
	            break;
	        case TX_TIMEOUT:
	              printf("\r\n TX_TIMEOUT \r\n");
	              break;
	        case TX_ERROR:
	            printf("\r\n TX_ERROR \r\n");
	              break;
	        case CRYPTO_ERROR:
	        	 printf("\r\n CRYPTO_ERROR \r\n");
	        	 break;
	        case TX_SCHEDULING_ERROR:
	            printf("\r\n Transmission Error - EventCode = %d \r\n", event);
	            // try again
	           // if (MBED_CONF_LORA_DUTY_CYCLE_ON) {
	           //     send_message();
	           // }
	            break;
	        case RX_DONE:
	            printf("\r\n Received message from Network Server \r\n");
	           // receive_message();
	            break;
	        case RX_TIMEOUT:
	            printf("\r\n RX_TIMEOUT \r\n");
	            break;
	        case RX_ERROR:
	            printf("\r\n Error in reception - Code = %d \r\n", event);
	            break;
	        case JOIN_FAILURE:
	            printf("\r\n OTAA Failed - Check Keys \r\n");
	            break;
	        case UPLINK_REQUIRED:
	            printf("\r\n Uplink required by NS \r\n");
	            if (MBED_CONF_LORA_DUTY_CYCLE_ON)
	            //	send_message("test");
	            break;
	        case AUTOMATIC_UPLINK_ERROR:
	            printf("\r\n AUTOMATIC_UPLINK_ERROR \r\n");
	            break;
	        default:
	            MBED_ASSERT("Unknown Event");
	    }
}

//void send_message(const char *message)
//{
//    uint16_t packet_len;
//    int16_t retcode;
//
//    packet_len = sprintf((char *) tx_buffer, "Message  %s",message);
//    retcode = lorawan.send(MBED_CONF_LORA_APP_PORT, tx_buffer, packet_len,MSG_UNCONFIRMED_FLAG);
//    if (retcode < 0) {
//        retcode == LORAWAN_STATUS_WOULD_BLOCK ? printf("send - WOULD BLOCK\r\n"): printf("\r\n send() - Error code %d \r\n", retcode);
//        if (retcode == LORAWAN_STATUS_WOULD_BLOCK) {
//            if (MBED_CONF_LORA_DUTY_CYCLE_ON) {
//                ev_queue.call_in(3000, &send_message,message);
//            }
//        }
//        return;
//    }
//    printf("\r\n %d bytes scheduled for transmission \r\n", retcode);
//    memset(tx_buffer, 0, sizeof(tx_buffer));
//}
//
//void  class_s(){
//    // if(lorawan.cancel_sending()==LORAWAN_STATUS_OK)
//  //     printf("\r\n cancel send ...\r\n");
//  // else{
//  //     printf("\r\n Error cancel send ...\r\n");
//  //     return -1;
//  // }
//
// 	lora_channelplan cp;
//	cp.nb_channels=8;
//	cp.channels=ttnChannels;
//   	if(lorawan.set_channel_plan(cp)==LORAWAN_STATUS_OK)
//		printf("\n\r chanel  ok\n\r");
//	else
//		printf("\n\r chanel  Error\n\r");
//
//   if(lorawan.disable_adaptive_datarate()==LORAWAN_STATUS_OK)
//       printf("\r\n disable_adaptive_datarate...\r\n");
//   else{
//       printf("\r\n Error disable_adaptive_datarate...\r\n");
//   }
//
//
//   if(lorawan.set_datarate(DR_0)==LORAWAN_STATUS_OK)
//       printf("\r\n set_datarate DR_0...\r\n");
//   else{
//       printf("\r\n Error set_datarate...\r\n");
//   }
//
//
//   //loramac_mlme_confirm_t mib_get_params;
//   //lorawan.mib_get_request(mib_get_params);
//
// //  radio.set_channel(868300000);
//
//   LoRa_PrintChannels();
//   if(lorawan.set_device_class(CLASS_C)==LORAWAN_STATUS_OK)
//       printf("\r\n set_device_class(CLASS_C)...\r\n");
//   else{
//       printf("\r\n Error set_device_class(CLASS_C)...\r\n");
//
//   }
//
//   device_class_t device_class =lorawan.get_device_class();
//   if(device_class==CLASS_A)
//       printf("\n\r Class A \n\r");
//   if(device_class==CLASS_B)
//       printf("\n\r Class B \n\r");
//   if(device_class==CLASS_C)
//       printf("\n\r Class C \n\r");
//   //lorawan.set_rx2_frequency_and_dr(868300000,DR_5);
//
//}
//
//void   multi(){
//    multicast_params_s channel_param;
//    channel_param.address=0x2c86c087;
//    memcpy(channel_param.nwk_skey,NWK_SKEY1,sizeof(NWK_SKEY1)); // @suppress("Function cannot be resolved")
//    memcpy(channel_param.app_skey,APP_SKEY1,sizeof(APP_SKEY1));
//    channel_param.dl_frame_counter=0;
//    channel_param.next=NULL;
//    if(lorawan.multicast_channel_link(&channel_param)== LORAWAN_STATUS_OK){
//       printf("\n\r multicast_channel_link  address 0x%08x   \n\r ",channel_param.address);
//       printf("nwk_skey  ");
//       for(int i = 0; i<16; i++)
//    	   printf("%#x ", channel_param.nwk_skey[i]);
//       printf("\n\r app_skey  \n\r");
//       for(int i = 0; i<16; i++)
//    	   printf("%#x ", channel_param.app_skey[i]);
//       printf(" \n\r");
//
//    }
//    else
//       printf("\n\r Error multicast_channel_link \n\r ");
//}
//
//void  receive_message()
//{
//    uint8_t port;
//    int flags;
//    int16_t retcode = lorawan.receive(rx_buffer, sizeof(rx_buffer), port, flags);
//
//    if (retcode < 0) {
//        printf("\r\n receive() - Error code %d \r\n", retcode);
//        return;
//    }
//
//    printf(" RX Data on port %u (%d bytes): ", port, retcode);
//    for (uint8_t i = 0; i < retcode; i++) {
//        printf("%02x ", rx_buffer[i]);
//    }
//    printf("\r\n");
//    printf("\r\n %s \r\n",rx_buffer);
//    lorawan_rx_metadata rxmeta;
//    if(lorawan.get_rx_metadata(rxmeta)==LORAWAN_STATUS_OK){
//    	printf("\n\r rssi: %d  rxdatarate: %d snr: %d \n\r",rxmeta.rssi,rxmeta.rx_datarate,rxmeta.snr);
//	}
//    recieve_callback((char*)rx_buffer,6);
//
//    memset(rx_buffer, 0, sizeof(rx_buffer));
//}
//
//void  LoRa_PrintChannels() {
//    /* print list of all channel frequencies */
//    lorawan_channelplan_t channelPlan= {};
//    static loramac_channel_t channelbuf[10];
//    channelPlan.channels = channelbuf;
//    if (lorawan.get_channel_plan(channelPlan) == LORAWAN_STATUS_OK) {
//        for (uint8_t i = 0; i < channelPlan.nb_channels; i++) {
//            loramac_channel_t chan = channelPlan.channels[i];
//            printf("CHAN %d ID %d FREQ %lu RX1FREQ %lu Band %d DR min %d max %d\n",
//                   (int) i, (int) chan.id, chan.ch_param.frequency,
//                   chan.ch_param.rx1_frequency, (int) chan.ch_param.band,
//                   (int) chan.ch_param.dr_range.fields.min,
//                   (int) chan.ch_param.dr_range.fields.max);
//        }
//    } else {
//        printf("COULD NOT GET CHANNEL PLAN\n"); // @suppress("Function cannot be resolved")
//    }
//}

#endif
