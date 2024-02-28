
import { ProsConsStreamUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { useState } from "react";


interface Message {
  text:string; 
  isGPT: boolean; 

}

export const ProsConsStreamPage = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] );

    const reader = await ProsConsStreamUseCase(text);

    setisLoading(false);

    if (!reader) return alert('No se pudo generar el reader');

    const decoder = new TextDecoder();

    let message = '';

    setMessages( messages => [ ...messages, { text:message, isGPT: true } ] );

    while (true) {

    const {  value, done} = await reader.read();

    if (done) break;
          

    const decodedChunk = decoder.decode(value, {stream: true});

    message  += decodedChunk

    setMessages( messages => {

      const newMessages = [ ...messages];
      
      newMessages [newMessages.length - 1].text = message;

      return newMessages

    });
    
    

       }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "Holi churri no te rayes esta todo guachi"/>

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? <GptMessage key={ index } text={ message.text } /> 
            : <MyMessage  key={ index } text={ message.text }/>
          ) )
         }

         {
          isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )

         }

        </div>
      </div>

      <TextMessageBox
      onSendMessage={ handlePost }
      placeHolder="Escribe aquí wapo"
      disableCorrections= {true} />
      
    </div>
  )
}
