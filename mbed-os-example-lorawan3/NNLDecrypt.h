

#ifndef NNLDECRYPT_H2_
#define NNLDECRYPT_H2_

#include "mbed.h"
#include "btree.h"


#if !defined(MBEDTLS_CONFIG_FILE)
#include "mbedtls/config.h"
#else
#include MBEDTLS_CONFIG_FILE
#endif

#include "mbedtls/arc4.h"
#include "mbedtls/md.h"
#include "mbedtls/sha1.h"

#if defined(MBEDTLS_ERROR_C)
#define PRINT_ERROR(RET, CODE)                              \
			mbedtls_strerror(RET, err_buf, sizeof(err_buf));        \
		    mbedtls_printf("%s returned -0x%04X\n", CODE, -RET);    \
		    mbedtls_printf("  !  %s\n", err_buf);
#else
#define PRINT_ERROR(RET, CODE)                              \
		    mbedtls_printf("%s returned -0x%04X\n", CODE, -RET);
#endif /* MBEDTLS_ERROR_C */

#define BYTEOFKEY	5
#define BYTEOFSUBELEMENT	1



typedef struct NNL_Info_t{
	uint8_t node_start;
	uint8_t node_label;
	uint8_t label[20];
}NNL_Info_s;

class NNLDecrypt {
public:
	NNLDecrypt();
	uint8_t DecryptForSUuser(const uint8_t subset_start,const uint8_t subset_end, const uint8_t *encKey, const uint8_t size_encKey,uint8_t *enc_message, const uint8_t size_enc_message,uint8_t *dec_message);
	virtual ~NNLDecrypt();
private :
	int Decrypt(const uint8_t *buffer, const uint8_t size, const uint8_t *key, const uint32_t key_length, uint8_t *dec_buffer);
	void printhex(const uint8_t *array, uint8_t size);
	//int generate_hash(const uint8_t *key,const int key_len,  const uint8_t *payload, const int payload_len,uint8_t *hmac_hash);
};
#endif /* NNLDECRYPT_H2_ */
