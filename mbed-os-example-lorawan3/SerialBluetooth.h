/*
 * SerialBluetooth.h
 *
 *  Created on: May 27, 2019
 *      Author: giannis
 */

#ifndef SERIALBLUETOOTH_H_
#define SERIALBLUETOOTH_H_

#include "mbed.h"
//#include "events/EventQueue.h"
#include "RawSerial.h"
//#include "mbed-memory-status/mbed_memory_status.h"
#include <string>

#define BUFFER_SIZE					242

using namespace std;
//using namespace events;

class SerialBluetooth  {
public:
	SerialBluetooth(Callback <void(const string)> recieve_cb,EventQueue *queue);
	virtual ~SerialBluetooth();
	void send(string message);
protected:
	Callback <void(const string)> recieve_callback;
	RawSerial bluetooth;
	EventQueue *ev_queue;
private:
	int bluetooth_index=0;
	void sendtosend(char *message, int len_message);
	char bluetooth_buffer[BUFFER_SIZE]={0};
	void rxCallback();
	void txCallback();
};

#endif /* SERIALBLUETOOTH_H_ */
