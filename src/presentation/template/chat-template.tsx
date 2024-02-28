
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../components"
import { useState } from "react";

interface Message {
  text:string; 
  isGPT: boolean; 

}

export const ChatTemplate = () => {

  const [isLoading, setisLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string) => {
    
    setisLoading(true); 
    
    setMessages( prev => [ ...prev, { text:text, isGPT: false } ] )

    // TODO: UseCase Esperamos a que lleguen los datos 

    setisLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "Holi churri no me entero de nada de nada"/>

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? <GptMessage key={ index } text="Esto viene de muy muy lejano" /> 
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
