

#include "MultiLora.h"
#include "lora_radio_helper.h"

#if (MBED_CONF_APP_LLNMULTICAST==1)
 uint8_t NWK_SKEY1[]={0xe7,0x8a,0x62,0xc2,0x50,0xff,0xa9,0x9d,0x40,0x07,0xb2,0x6a,0xd3,0x98,0xcc,0xee};
 uint8_t APP_SKEY1[]={0x99,0xd1,0xac,0x0e,0xaa,0xb9,0x77,0xf5,0xe1,0x5e,0x91,0x0d,0x56,0xc5,0x45,0xf1};
 loramac_channel_t ttnChannels[] = {
		        {3, {867100000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {4, {867300000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {5, {867500000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {6, {867700000, 0, {(DR_5 << 4) | DR_0}, 0}},
		        {7, {867900000, 0, {(DR_5 << 4) | DR_0}, 0}}
		};
#endif//MBED_CONF_APP_LLNMULTICAST


static LoRaWANInterface lorawan(radio);


MultiLora::MultiLora(Callback <void(const string)> recieve_cb,EventQueue *queue):recieve_callback(recieve_cb),ev_queue(queue)
{
	sendToCallBackRecievedString((uint8_t*)"",false);

}

void MultiLora::connect(){
	if(lowan_init)
		 this->tryconnect();
	else
		this->init();
}

int MultiLora::init(){
		// stores the status of a call to LoRaWAN protocol

	    // Initialize LoRaWAN stack
	    if (lorawan.initialize(MultiLora::ev_queue) != LORAWAN_STATUS_OK) {
	        //printf("\r\n LoRa initialization failed! \r\n");
	        return -1;
	    }
	    //printf("\r\n Mbed LoRaWANStack initialized \r\n");

	    // prepare application callbacks
	    MultiLora::callbacks.events = mbed::callback(this,&MultiLora::lora_event_handler);    //lorawan.add_app_callbacks(&callbacks);

	    lorawan.add_app_callbacks(&callbacks);

	    // Set number of retries in case of CONFIRMED messages
	    lorawan.set_confirmed_msg_retries(CONFIRMED_MSG_RETRY_COUNTER);
	    if (lorawan.set_confirmed_msg_retries(CONFIRMED_MSG_RETRY_COUNTER)!= LORAWAN_STATUS_OK) {
	        ////printf("\r\n set_confirmed_msg_retries failed! \r\n\r\n");
	        return -1;
	    }

	    //printf("\r\n CONFIRMED message retries : %d \r\n",CONFIRMED_MSG_RETRY_COUNTER);

	    // Enable adaptive data rate
	    if (lorawan.enable_adaptive_datarate() != LORAWAN_STATUS_OK) {
	        //printf("\r\n enable_adaptive_datarate failed! \r\n\r\n");
	        return -1;
	    }
	    //printf("\r\n Adaptive data  rate (ADR) - Enabled \r\n\r\n");

	   // LoRa_PrintChannels();


#if (MBED_CONF_APP_LLNMULTICAST==1)
//		this->multi();
#endif//MBED_CONF_APP_LLNMULTICAST
	    this->lowan_init=true;
#if (MBED_CONF_APP_SERIALBLUETOOTH==0)
	    this->tryconnect();
#endif//MBED_CONF_APP_SERIALBLUETOOTH

}

void MultiLora::disconnect(){
	lorawan.disconnect();
}


//void printhex(char *str, uint8_t *ar,int size){
//	//printf(" %s ",str);
//	for(int x=0;x<size;x++)
//		//printf(" %02X ",ar[x]);
//	//printf("\n\r");
//}

int MultiLora::tryconnect(){
	uint8_t eui[]=MBED_CONF_LORA_APPLICATION_EUI;
	uint8_t key[]=MBED_CONF_LORA_APPLICATION_KEY;
	uint8_t dev[]=MBED_CONF_LORA_DEVICE_EUI;
	//printhex("MBED_CONF_LORA_APPLICATION_EUI",eui,16);
	//printhex("MBED_CONF_LORA_APPLICATION_KEY",key,16);
	//printhex("MBED_CONF_LORA_DEVICE_EUI",dev,8);

	lorawan_status_t retcode=lorawan.connect();

	if ( retcode== LORAWAN_STATUS_OK || retcode == LORAWAN_STATUS_CONNECT_IN_PROGRESS) {
		//printf("\r\n Try Connected! \r\n");
		return 0;

	} else {
		//printf("\r\n Not Connected %d \r\n",retcode);
	//	 ev_queue->call_in(10000, this,&MultiLora::tryconnect);
		return -1;
	}
}

MultiLora::~MultiLora(){
	ev_queue->call(this,&MultiLora::disconnect);
	ev_queue->break_dispatch();
}

void MultiLora::sendInfo(){
	sendToCallBackRecievedString((uint8_t*)"",isConnected);
};

void MultiLora::sendToCallBackRecievedString( uint8_t *message){
	this->sendToCallBackRecievedString(message,true);
}

void MultiLora::sendToCallBackRecievedString( const uint8_t *message,bool withAdditions=false){
    char tmpbuff[BUFFER_SIZE]={0};
    int lenmessage=0;
	if(withAdditions){
		lorawan_rx_metadata rxmeta;
		if(lorawan.get_rx_metadata(rxmeta)==LORAWAN_STATUS_OK)
			lenmessage=sprintf(tmpbuff,"{ \"LoraConnect\":\"%d\", \"LoraClass\":\"%d\" , \"Loradata\":\"%s\" ,\"LoraRSSI\":\"%d\" , \"LoraRXDataRate\":\"%d\" , \"LoraSNR\":\"%d\" }\r\n",this->isConnected, this->classType,(char*)message,rxmeta.rssi,rxmeta.rx_datarate,rxmeta.snr);
		else
			lenmessage=sprintf(tmpbuff,"{\"LoraConnect\":\"%d\", \"LoraClass\":\"%d\" , \"Loradata\":\"\" }\r\n",this->isConnected, this->classType);
	}
	else{
		lenmessage=sprintf(tmpbuff,"{\"LoraConnect\":\"%d\", \"LoraClass\":\"%d\" , \"Loradata\":\"%s\" }\r\n",this->isConnected, this->classType,(char*)message);
	}
	//printf("sendToCallBackRecievedString %s",tmpbuff );
	const string a(tmpbuff);
	this->recieve_callback(a);
}


void MultiLora::lora_event_handler(lorawan_event_t event)
{
		//printf("lora_event_handler");
		switch (event) {
	        case CONNECTED:
	            //printf("\r\n Connection - Successful \r\n");
	            isConnected=true;
#if (MBED_CONF_APP_LLNMULTICAST==1)
		this->multi();
#endif//MBED_CONF_APP_LLNMULTICAST

	            class_c();
	            sendToCallBackRecievedString((uint8_t*)"",false);
	            send("hello");
	            break;
	        case DISCONNECTED:
	        	isConnected=false;
	            //printf("\r\n Disconnected Successfully \r\n");
	            sendToCallBackRecievedString((uint8_t*)"",false);
	            break;
	        case TX_DONE:
	            //printf("\r\n Message Sent to Network Server \r\n");
	            break;
	        case TX_TIMEOUT:
	              //printf("\r\n TX_TIMEOUT \r\n");
	              break;
	        case TX_ERROR:
	            //printf("\r\n TX_ERROR \r\n");
	            break;
	        case CRYPTO_ERROR:
	        	//printf("\r\n CRYPTO_ERROR \r\n");
	        	break;
	        case TX_SCHEDULING_ERROR:
	            //printf("\r\n Transmission Error - EventCode = %d \r\n", event);
	            // try again
	           // if (MBED_CONF_LORA_DUTY_CYCLE_ON) {
	           //     send_message();
	           // }
	            break;
	        case RX_DONE:
	            //printf("\r\n Received message from Network Server \r\n");
	            receive_message();
	            break;
	        case RX_TIMEOUT:
	            //printf("\r\n RX_TIMEOUT \r\n");
	            break;
	        case RX_ERROR:
	            //printf("\r\n Error in reception - Code = %d \r\n", event);
	            break;
	        case JOIN_FAILURE:
	            //printf("\r\n OTAA Failed - Check Keys \r\n");
	            sendToCallBackRecievedString((uint8_t*)"",false);
	            break;
	        case UPLINK_REQUIRED:
	            //printf("\r\n Uplink required by NS \r\n");
	            if (MBED_CONF_LORA_DUTY_CYCLE_ON)
	//            	send_message("test");
	            break;
	        case AUTOMATIC_UPLINK_ERROR:
	            //printf("\r\n AUTOMATIC_UPLINK_ERROR \r\n");
	            break;
	        default:
	            MBED_ASSERT("Unknown Event");
	    }
}
void  MultiLora::receive_message()
{
    uint8_t port;
    int flags;
    uint8_t tmpbuff[BUFFER_SIZE]={NULL};
    int16_t retcode = lorawan.receive(tmpbuff, sizeof(tmpbuff), port, flags);

//    if (retcode < 0) {
//        //printf("\r\n receive() - Error code %d \r\n", retcode);
//        return;
//    }
   //printf("\r\n %s \r\n",tmpbuff);
    //printf("\r\n RECIEVE \r\n");

#if (MBED_CONF_APP_LLNMULTICAST==1)
    if(port==100){
    	bool readytoprossedthedata=false;

    	int maxpayload;
    	if(cur_DR<3)
    		maxpayload=51;
    	else if(cur_DR==3)
    		maxpayload=115;
    	else if(cur_DR>3)
    		maxpayload=242;

    	if(tmpbuff[0]>=0 && tmpbuff[0]<64){

    		subsetnum=tmpbuff[1];
    		if(tmpbuff[0]==0){
    			maxframecount=1;
    			readytoprossedthedata=true;
    			//printf("\r\n only one \r\n");
    		}
    		else{
    			maxframecount=tmpbuff[0];
    		}
    		countframe=1;

    		index_inbuffer=-1;

    		inbuffer=(uint8_t*)malloc(sizeof(uint8_t)*maxpayload*maxframecount);
    		int x=2;
    		while(x<BUFFER_SIZE && !(tmpbuff[x]==NULL && tmpbuff[x+1]==NULL) )
    			inbuffer[++index_inbuffer]=tmpbuff[x++];
    		//printf("\r\n  maxframecount %d countframe %d subsetnum %d x %d index_inbuffer %d \r\n",maxframecount,countframe,subsetnum,x,index_inbuffer);
    	}
    	else if(tmpbuff[0]<128){
    		if(countframe+1==tmpbuff[0]-64){
    			countframe=tmpbuff[0]-64;
    			int x=1;
    			while(x<BUFFER_SIZE && !(tmpbuff[x]==NULL && tmpbuff[x+1]==NULL) )
    				inbuffer[++index_inbuffer]=tmpbuff[x++];
    			//printf("\r\n  maxframecount %d countframe %d  x %d index_inbuffer %d\r\n",maxframecount,countframe,x,index_inbuffer);
    		}
    		else{
    			//printf("\r\nerror   maxframecount %d countframe %d \r\n",maxframecount,countframe);
    				if(inbuffer!=NULL)
    					free(inbuffer);
					subsetnum=0;
					countframe=0;
					index_inbuffer=-1;
    		}
    	}
    	else if(tmpbuff[0]<192){

        }
    	else{
    		if(tmpbuff[0]-192==countframe+1 && tmpbuff[0]-192== maxframecount){
    			countframe=tmpbuff[0]-192;
    			int x=1;
    			while(x<BUFFER_SIZE && !(tmpbuff[x]==NULL && tmpbuff[x+1]==NULL) )
    				inbuffer[++index_inbuffer]=tmpbuff[x++];
				readytoprossedthedata=true;
				//printf("\r\nfinish   maxframecount %d countframe %d x %d index_inbuffer %d\r\n",maxframecount,countframe,x,index_inbuffer);
    		}
    		else{
    			//printf("\r\nerror fin  maxframecount %d countframe %d \r\n",maxframecount,countframe);
    			if(inbuffer!=NULL)
    			    free(inbuffer);
    			subsetnum=0;
    			countframe=0;
    			index_inbuffer=-1;
    		}
    	}
    	if(readytoprossedthedata){
    		NNLDecrypt *nnldecrypt=new NNLDecrypt();
    					int size_enc_message=index_inbuffer-(subsetnum*(BYTEOFKEY+BYTEOFSUBELEMENT+BYTEOFSUBELEMENT))+1;
    		        	uint8_t enc_message[size_enc_message]={0};
    		            uint8_t dec_message[size_enc_message+1]={0};
    		            memcpy(enc_message,inbuffer+subsetnum*(BYTEOFKEY+BYTEOFSUBELEMENT+BYTEOFSUBELEMENT),size_enc_message);
    		            uint8_t size_dec_message;
    		        	for(int x=0;x<subsetnum*(BYTEOFKEY+BYTEOFSUBELEMENT+BYTEOFSUBELEMENT);x++){
    		        		uint8_t start=inbuffer[x];
    		        		uint8_t end=inbuffer[++x];
    		        		uint8_t key[BYTEOFKEY];
    		        		for(int z=0;z<sizeof(key);z++){
    		        			key[z]=inbuffer[++x];
    		        		}
    		        		size_dec_message=nnldecrypt->DecryptForSUuser(start,end,key,sizeof(key),enc_message,size_enc_message,dec_message);
    		        		if(size_dec_message>0)
    		        			break;
    		        	}
    		    		if(size_dec_message>0)
    		    			sendToCallBackRecievedString(dec_message,true);
    		        	delete(nnldecrypt);
    		        	free(inbuffer);
    		        	subsetnum=0;
    		        	countframe=0;
    		        	index_inbuffer=-1;
    	}
    }
    else
    	//ev_queue->call(this,&MultiLora::sendToCallBackRecievedString,( rx_buffer,true));
#endif//MBED_CONF_APP_LLNMULTICAST
    	sendToCallBackRecievedString(tmpbuff,true);
}

void MultiLora::send (string message) {
	if(this->isConnected)
		ev_queue->call(this,&MultiLora::send_message,(string)message);
};

void MultiLora::send_message(string message)
{
   // uint16_t packet_len;
    int16_t retcode;
    char s_message[message.size()+1];
    strcpy(s_message,message.c_str());
    retcode = lorawan.send(MBED_CONF_LORA_APP_PORT, (uint8_t *)s_message, strlen(s_message),MSG_UNCONFIRMED_FLAG);
    if (retcode < 0) {
       // retcode == LORAWAN_STATUS_WOULD_BLOCK ? printf("send - WOULD BLOCK\r\n"): printf("\r\n send() - Error code %d \r\n", retcode);
        if (retcode == LORAWAN_STATUS_WOULD_BLOCK) {
            if (MBED_CONF_LORA_DUTY_CYCLE_ON) {
                ev_queue->call_in(3000, this,&MultiLora::send_message,(string) message);
            }
        }
        return;
    }
}


void  MultiLora::class_c(){
	//Clear tx queue
	lorawan.cancel_sending();
//	if(lorawan.cancel_sending()==LORAWAN_STATUS_OK)
//       printf("\r\n cancel send ...\r\n");
//     else
//       printf("\r\n Error cancel send ...\r\n");

	 //lorawan.set_rx2_frequency_and_dr(868100000,DR_0);

#if (MBED_CONF_APP_LLNMULTICAST==1)

   	//Disable Adaptive Data Rate
		lorawan.disable_adaptive_datarate();
//   if(lorawan.disable_adaptive_datarate()==LORAWAN_STATUS_OK)
//       printf("\r\n disable_adaptive_datarate...\r\n");
//   else{
//       printf("\r\n Error disable_adaptive_datarate...\r\n");
//   }
   //Data Rate  DR_0  SF12 , BW 125 KHz, 250 bits/s 51 byte
      //Data Rate  DR_1  SF11 , BW 125 KHz, 440 bits/s 51 byte
      //Data Rate  DR_2  SF10 , BW 125 KHz, 980 bits/s 51 byte
      //Data Rate  DR_3  SF9 , BW 125 KHz, 1760 bits/s 115 byte
      //Data Rate  DR_4  SF8 , BW 125 KHz, 3125 bits/s 242 byte
      //Data Rate  DR_5  SF7 , BW 125 KHz, 5470 bits/s 242 byte
		lorawan.set_datarate(cur_DR);
//	if(lorawan.set_datarate(cur_DR)==LORAWAN_STATUS_OK)
//       printf("\r\n set_datarate DR_%d...\r\n",cur_DR);
//   else{
//       printf("\r\n Error set_datarate...\r\n");
//   }
#endif//MBED_CONF_APP_LLNMULTICAST


   //Enable Class C
   lorawan.set_device_class(CLASS_C);
//   if(lorawan.set_device_class(CLASS_C)==LORAWAN_STATUS_OK)
//       printf("\r\n set_device_class(CLASS_C)...\r\n");
//   else
//       printf("\r\n Error set_device_class(CLASS_C)...\r\n");
   //Verify Class
   //device_class_t device_class =lorawan.get_device_class();
//   if(device_class==CLASS_A){
//	   classType=0;
//       printf("\n\r Class A \n\r");
//   }
//   if(device_class==CLASS_B){
//	   classType=1;
//       rintf("\n\r Class B \n\r");
//   }
//   if(device_class==CLASS_C){
//	   classType=2;
//     printf("\n\r Class C \n\r");
//   }

   //LoRa_PrintChannels();

}
#if (MBED_CONF_APP_LLNMULTICAST==1)
void   MultiLora::multi(){
  //  multicast_params_t* channel_param = new multicast_params_t();
	multicast_params_t channel_param;
    channel_param.address=0x2c86c087;
    int a=sizeof(NWK_SKEY1);
    memcpy(channel_param.nwk_skey,NWK_SKEY1,a);
    memcpy(channel_param.app_skey,APP_SKEY1,a);
    channel_param.dl_frame_counter=0;
    channel_param.next=NULL;
    lorawan.multicast_channel_link(channel_param);
//    if(lorawan.multicast_channel_link(channel_param)== LORAWAN_STATUS_OK){
//       //printf("\n\r multicast_channel_link  address 0x%08x   \n\r ",channel_param.address);
//       //printf("nwk_skey  ");
//       for(int i = 0; i<16; i++)
//    	   //printf("%#x ", channel_param.nwk_skey[i]);
//       //printf("\n\r app_skey  \n\r");
//       for(int i = 0; i<16; i++)
//    	   //printf("%#x ", channel_param.app_skey[i]);
//       //printf(" \n\r");
//
//    }
//    else
//       //printf("\n\r Error multicast_channel_link \n\r ");


}
#endif//MBED_CONF_APP_LLNMULTICAST

//void  MultiLora::LoRa_PrintChannels() {
//    /* print list of all channel frequencies */
//    lorawan_channelplan_t channelPlan= {};
//    loramac_channel_t channelbuf[10];
//    channelPlan.channels = channelbuf;
//    if (lorawan.get_channel_plan(channelPlan) == LORAWAN_STATUS_OK) {
//        for (uint8_t i = 0; i < channelPlan.nb_channels; i++) {
//            loramac_channel_t chan = channelPlan.channels[i];
//            //printf("CHAN %d ID %d FREQ %lu RX1FREQ %lu Band %d DR min %d max %d\n",
//                   (int) i, (int) chan.id, chan.ch_param.frequency,
//                   chan.ch_param.rx1_frequency, (int) chan.ch_param.band,
//                   (int) chan.ch_param.dr_range.fields.min,
//                   (int) chan.ch_param.dr_range.fields.max);
//        }
//    } else {
//        //printf("COULD NOT GET CHANNEL PLAN\n"); // @suppress("Function cannot be resolved")
//    }
//}

