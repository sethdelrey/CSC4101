
package project2csc4101;


public class Project2CSC4101 {


    public static void main(String[] args) {

        
        //1 | 10000101 | 11101000100010000101010
        System.out.println(Convertor.IEEE754(-122.13313361)); 
        
        //0 | 10000101 | 00110110010000111001010
        System.out.println(Convertor.IEEE754(77.566)); 
        
        //0 | 01111110 | 10001101000110110111000
        System.out.println(Convertor.IEEE754(0.7756)); 
        
        //1 | 01110111 | 10111001000011101010100
        System.out.println(Convertor.IEEE754(-0.00673)); 
    }
    
}