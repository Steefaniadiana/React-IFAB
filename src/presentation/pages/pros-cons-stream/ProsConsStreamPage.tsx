
import { ProsConsStreamGeneratorUseCase, } from "../../../core/use-cases";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { useRef, useState } from "react";


interface Message {
  text:string; 
  isGPT: boolean; 

}

export const ProsConsStreamPage = () => {

  const abortController = useRef (new AbortController());

  const isRunning = useRef(false);

  const [isLoading, setisLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    if(isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }
    
    setisLoading(true); 
    isRunning.current = true;
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] );

    const stream = ProsConsStreamGeneratorUseCase(text, abortController.current.signal);

    setisLoading(false);

    setMessages( messages => [ ...messages, { text: '', isGPT: true } ] );

    for await (const text of stream) {
      setMessages(messages => {
        const newMessages = [ ...messages];
        newMessages [ newMessages.length -1 ].text = text;
        return newMessages;

    })
  }

  isRunning.current = false;

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
