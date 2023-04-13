#include <iostream>
#include <cstring>
#include <iomanip>
#include <sstream>

#include <vector>

#include <openssl/sha.h>
int main(void)
{
    std::vector<std::string> vecScripts;
    vecScripts.push_back("1 EQUALVERIFY (0x5188)");
    vecScripts.push_back("2 EQUALVERIFY (0x5288)");
    vecScripts.push_back("3 EQUALVERIFY (0x5388)");
    vecScripts.push_back("4 EQUALVERIFY (0x5488)");
    vecScripts.push_back("5 EQUALVERIFY (0x5588)");
    vecScripts.push_back("6 EQUALVERIFY (0x5688)");
    vecScripts.push_back("7 EQUALVERIFY (0x5788)"); 
    vecScripts.push_back("8 EQUALVERIFY (0x5888)");

    std::string message = "RETURN \"Hello\" (0x6a0548656c6c6f)";

    // std::vector<std::string> vecHashedScript;
    // vecHashedScript.resize(8);
    std::vector<u_char*> vecHashedScripts;
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    for (std::string Si : vecScripts)
    {
        u_char* Hi = (u_char*)malloc(SHA256_DIGEST_LENGTH);
        SHA256_Update(&sha256, Si.data(), Si.size());
        SHA256_Final(Hi, &sha256);
        vecHashedScripts.push_back(Hi);
    }
    
    for(int i =0; i < SHA256_DIGEST_LENGTH; i++)
    {
        printf("%#x ", vecHashedScripts[0][i]);
    }
    std::cout << std::endl;
}