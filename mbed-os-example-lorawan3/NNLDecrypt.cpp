
#include "NNLDecrypt.h"
#include "mbedtls/platform.h"

#if defined(MBEDTLS_ARC4_C)

NNLDecrypt::NNLDecrypt() {
#if defined(MBEDTLS_PLATFORM_C)
    int ret = mbedtls_platform_setup(NULL);
    if (ret != 0) {
    }
#endif /* MBEDTLS_PLATFORM_C */
}

int generate_hash(const uint8_t *key,const int key_len,  const uint8_t *payload, const int payload_len,uint8_t *hmac_hash)
{
  uint8_t my_hmac_hash[payload_len] = {'\0'};
  mbedtls_md_context_t ctx;
  mbedtls_md_type_t md_type = MBEDTLS_MD_SHA1;
  uint8_t payload_buffer[payload_len] = {'\0'};
  memcpy(payload_buffer, payload,payload_len);
  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type) , 1); //use hmac
  mbedtls_md_hmac_starts(&ctx, key, key_len);
  mbedtls_md_hmac_update(&ctx, (const unsigned char *) payload_buffer, payload_len);
  mbedtls_md_hmac_finish(&ctx, my_hmac_hash);
  memcpy(hmac_hash,my_hmac_hash,sizeof(my_hmac_hash));
  mbedtls_md_free(&ctx);
  return sizeof(my_hmac_hash);
}

static uint8_t* g_L(uint8_t *label){
	uint8_t key[20];
	int sk=generate_hash((const uint8_t *)'left',4, label, 20,key);
	return key;
}

static uint8_t* g_R(uint8_t *label){
	uint8_t key[20];
	int sk=generate_hash((const uint8_t *)'right',5, label, 20,key);
	return key;
}


uint8_t NNLDecrypt::DecryptForSUuser(const uint8_t subset_start,const uint8_t subset_end, const uint8_t *encKey, const uint8_t size_encKey,uint8_t *enc_message, const uint8_t size_enc_message,uint8_t *dec_message){
	const NNL_Info_s keyarray[]={
			{0x00,0x00,0x22,0x72,0x8a,0x73,0xa6,0x1b,0x98,0x99,0xc2,0x91,0x0f,0x96,0x3b,0x21,0xa5,0x1b,0xdd,0x71,0xf6,0x52},
			{0x07,0x10,0xd3,0x1a,0xae,0x39,0x0f,0xb9,0xf6,0x68,0xe2,0x9a,0x47,0x94,0x79,0xc4,0x15,0x2c,0x46,0xe8,0x76,0x3a},
			{0x03,0x10,0xd3,0x1a,0xae,0x39,0x0f,0xb9,0xf6,0x68,0xe2,0x9a,0x47,0x94,0x79,0xc4,0x15,0x2c,0x46,0xe8,0x76,0x3a},
			{0x03,0x08,0xa3,0xdd,0xad,0x20,0x0d,0x8f,0xca,0x19,0xbc,0x7b,0xb6,0xb4,0x92,0x24,0x68,0x61,0xa6,0xf7,0x39,0x38},
			{0x01,0x10,0xd3,0x1a,0xae,0x39,0x0f,0xb9,0xf6,0x68,0xe2,0x9a,0x47,0x94,0x79,0xc4,0x15,0x2c,0x46,0xe8,0x76,0x3a},
			{0x01,0x08,0xa3,0xdd,0xad,0x20,0x0d,0x8f,0xca,0x19,0xbc,0x7b,0xb6,0xb4,0x92,0x24,0x68,0x61,0xa6,0xf7,0x39,0x38},
			{0x01,0x04,0x11,0xda,0xaf,0x24,0x96,0x54,0xcf,0xf2,0xf1,0xcf,0x4b,0x87,0xa3,0x7b,0x47,0xbd,0x53,0x9e,0x49,0xac},
			{0x00,0x10,0xd3,0x1a,0xae,0x39,0x0f,0xb9,0xf6,0x68,0xe2,0x9a,0x47,0x94,0x79,0xc4,0x15,0x2c,0x46,0xe8,0x76,0x3a},
			{0x00,0x08,0xa3,0xdd,0xad,0x20,0x0d,0x8f,0xca,0x19,0xbc,0x7b,0xb6,0xb4,0x92,0x24,0x68,0x61,0xa6,0xf7,0x39,0x38},
			{0x00,0x04,0x11,0xda,0xaf,0x24,0x96,0x54,0xcf,0xf2,0xf1,0xcf,0x4b,0x87,0xa3,0x7b,0x47,0xbd,0x53,0x9e,0x49,0xac},
			{0x00,0x02,0x27,0x67,0xf1,0xdd,0x90,0xb9,0xfe,0xbb,0x71,0xf8,0x76,0x63,0xa2,0x18,0xc7,0x21,0xa3,0x96,0x34,0xf9}
			};

	const int size_of_NNL_info=sizeof(keyarray)/sizeof(NNL_Info_s) ;
	bool cont=false;
	uint8_t dec_key[size_encKey];
	const int  size_of_key=sizeof(keyarray)-2;
	uint8_t key[size_of_key];
	uint8_t a[20]={0xe0,0xfd,0x05,0x2e,0x0c,0x8d,0xd5,0xb5,0x3e,0xc8,0x02,0xab,0x4b,0x80,0xcf,0x29,0x5d,0xdb,0x9a,0x8b};
	for(int x=0;x<size_of_NNL_info ;x++){
			if(subset_start==keyarray[x].node_start && subset_end==keyarray[x].node_label){
				cont=true;
				//int sk=generate_hash((const uint8_t *)'key',3, keyarray[x].label, size_of_key,key);
				memcpy(key,a,sizeof(a));
				break;
			}
	}
	if(!cont){
		btree *tree = new btree(30);
		for(int x=0;x<size_of_NNL_info ;x++){
				if(subset_start==keyarray[x].node_start){
					//uint8_t label[20];
					//memcpy(label,tree->calculatesublabel(keyarray[x].node_label, subset_end,g_L,g_R),20);
					if(tree->isChildOf(keyarray[x].node_label,subset_end)){
						cont=true;
						//int sk=generate_hash((const uint8_t *)'key',3, keyarray[x].label, size_of_key,key);
						memcpy(key,a,sizeof(a));
						break;
					}
				}
		}
		delete(tree);
	}
	if(cont)
	{
		//printf("\n\r encrypt key  ");
		//printhex(encKey,size_encKey);
		//printf("\n\r key for encrypt key  ");
		//printhex(keyarray[x].NNL_Info_key,size_of_key);
		if(NNLDecrypt::Decrypt(encKey,size_encKey,key,size_of_key,dec_key)==0){
			//printf("\n\r decrypt key  %.*s  \n\r",size_encKey,dec_key);
		       //printhex(dec_key,size_encKey);

		        //printf("\n\r encrypt message ");
		        //printhex(enc_message,size_enc_message);
			if(NNLDecrypt::Decrypt(enc_message,size_enc_message,dec_key,size_encKey,dec_message)==0){
				//printf("\n\r decrypt message  %.*s  \n\r",size_enc_message,dec_message);
				//printhex(dec_message,size_enc_message);
				return size_enc_message;
			}
			else
				return 0;
		}
		else
			return 0;
	}
	return 0;
}


void NNLDecrypt::printhex(const uint8_t *array, uint8_t size){
	for(int x=0;x<size;x++){
		if(x==size-1)
			printf("0x%02x",array[x]);
		else
			printf("0x%02x,",array[x]);
	}
	printf("\n\r");
}

int  NNLDecrypt::Decrypt(const uint8_t *buffer, const uint8_t size, const uint8_t *key, const uint32_t key_length, uint8_t *dec_buffer){

	mbedtls_arc4_context arc4_context;

	mbedtls_arc4_init(&arc4_context);


	mbedtls_arc4_setup(&arc4_context, key, key_length);

	int retval = mbedtls_arc4_crypt(&arc4_context,size,buffer,dec_buffer);

	mbedtls_arc4_free(&arc4_context);
	return retval;

}

NNLDecrypt::~NNLDecrypt() {
	 // mbedtls_platform_teardown(NULL);
}

#endif /* MBEDTLS_ARC4_C */


