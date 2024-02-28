
import { ProsConsUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { useState } from "react";

interface Message {
  text:string; 
  isGPT: boolean; 

}

export const ProsConsPage = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] )

const {ok, content} = await ProsConsUseCase(text)

    setisLoading(false);

    if (!ok) return;

    setMessages( prev => [ ...prev, { text: content, isGPT: true }]);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "Holi churri, cuales son tus dudas?"/>

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
