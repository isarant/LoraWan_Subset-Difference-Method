/*
 * L.h
 *
 *  Created on: Jun 2, 2019
 *      Author: giannis
 */

#ifndef L_H_
#define L_H_

#include "lorawan/LoRaWANInterface.h"
#include "lorawan/system/lorawan_data_structures.h"
#include "LoRaMac.h"
#include "lorawan/LoRaRadio.h"
#include "lora_radio_helper.h"
#include "events/EventQueue.h"

#define TX_TIMER                        10000
#define MAX_NUMBER_OF_EVENTS            10
#define CONFIRMED_MSG_RETRY_COUNTER     3
#define BUFFER_SIZE                 150

uint8_t tx_buffer[BUFFER_SIZE];
uint8_t rx_buffer[BUFFER_SIZE];

using namespace events;

LoRaWANInterface lorawan(radio);
lorawan_app_callbacks_t callbacks;
static EventQueue ev_queue(MAX_NUMBER_OF_EVENTS *EVENTS_EVENT_SIZE);
void lora_event_handler(lorawan_event_t event);


/**
 * Sends a message to the Network Server
 */
 void send_message()
{
    uint16_t packet_len;
    int16_t retcode;
    float sensor_value;

        sensor_value = 15;


    packet_len = sprintf((char *) tx_buffer, "Dummy Sensor Value is %3.1f",
                         sensor_value);

    retcode = lorawan.send(MBED_CONF_LORA_APP_PORT, tx_buffer, packet_len,
                           MSG_UNCONFIRMED_FLAG);

    if (retcode < 0) {
        retcode == LORAWAN_STATUS_WOULD_BLOCK ? printf("send - WOULD BLOCK\r\n")
        : printf("\r\n send() - Error code %d \r\n", retcode);

        if (retcode == LORAWAN_STATUS_WOULD_BLOCK) {
            //retry in 3 seconds
            if (MBED_CONF_LORA_DUTY_CYCLE_ON) {
                ev_queue.call_in(3000, send_message);
            }
        }
        return;
    }

    printf("\r\n %d bytes scheduled for transmission \r\n", retcode);
    memset(tx_buffer, 0, sizeof(tx_buffer));
}

/**
 * Receive a message from the Network Server
 */
 void receive_message()
{
    uint8_t port;
    int flags;
    int16_t retcode = lorawan.receive(rx_buffer, sizeof(rx_buffer), port, flags);

    if (retcode < 0) {
        printf("\r\n receive() - Error code %d \r\n", retcode);
        return;
    }

    printf(" RX Data on port %u (%d bytes): ", port, retcode);
    for (uint8_t i = 0; i < retcode; i++) {
        printf("%02x ", rx_buffer[i]);
    }
    printf("\r\n");

    memset(rx_buffer, 0, sizeof(rx_buffer));
}

/**
 * Event handler
 */

 void lora_event_handler(lorawan_event_t event)
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
                //  send_message("test");
                break;
            case AUTOMATIC_UPLINK_ERROR:
                printf("\r\n AUTOMATIC_UPLINK_ERROR \r\n");
                break;
            default:
                MBED_ASSERT("Unknown Event");
        }
}


#endif /* L_H_ */
