/*
 * SerialBluetooth.cpp
 *
 *  Created on: May 27, 2019
 *      Author: giannis
 */

#include "SerialBluetooth.h"
Mutex mutex;

SerialBluetooth::SerialBluetooth(Callback <void(const string)> recieve_cb,EventQueue *queue):recieve_callback(recieve_cb), bluetooth(MBED_CONF_APP_BLUETOOTH_TX,MBED_CONF_APP_BLUETOOTH_RX,9600),ev_queue(queue) {
	int bluetooth_index=0;
	this->bluetooth.attach(callback( this,&SerialBluetooth::rxCallback),Serial::RxIrq);
}

SerialBluetooth::~SerialBluetooth() {
	terminate();
}

void SerialBluetooth::send(string message){
	char s_message[message.size()+1];
	strcpy(s_message,message.c_str());
	this->bluetooth.puts(s_message);
}

void SerialBluetooth::rxCallback(){
	if(this->bluetooth.readable()){
				char inputChar=this->bluetooth.getc();
				if(bluetooth_index<BUFFER_SIZE){
					bluetooth_buffer[bluetooth_index++]=inputChar;
				}
				if(inputChar=='\n'){
					bluetooth_buffer[bluetooth_index++]='\0';
					//this->recieve_callback(bluetooth_buffer,--bluetooth_index);
					//mutex.lock();
					//ev_queue->call(this,&SerialBluetooth::sendtosend,(string)a);
					ev_queue->call(this,&SerialBluetooth::sendtosend,bluetooth_buffer,--bluetooth_index);
					//ev_queue->call(this,&SerialBluetooth::recieve_callback,(const string)a);
				}
		}

}

void SerialBluetooth::sendtosend(char *message, int len_message){
	string a(message);
	this->recieve_callback((const string)message);
	bluetooth_index=0;
    memset(message, 0, BUFFER_SIZE);
	//mutex.unlock();
}

 void SerialBluetooth::txCallback(){

}
