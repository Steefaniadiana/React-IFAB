

import { translateTextUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components"
import { useState } from "react";

interface Message {
  text:string; 
  isGPT: boolean; 

}
const languages = [
  { id: "alemán", text:"Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "latín", text: "Latín" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
  { id:"rumano", text: "Rumano"},
  { id:"murciano", text: "Murciano"},
  { id:"canario", text: "Canario"},
]

export const TranslatePage = () => {

  const [isLoading, setisLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);



  const handlePost = async(text: string, selectedOption: string) => {
    
    setisLoading(true); 
    
    const newMessage = `Traduce: "${ text }" al idioma ${selectedOption}`

    setMessages( prev => [ ...prev, { text: newMessage, isGPT: false } ]);

   const { ok, message } = await translateTextUseCase (text, selectedOption);

    setisLoading(false);

    if (!ok ) {
      return alert(message);
    }

    setMessages(prev => [...prev, {text: message, isGPT: true}]);


  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
         <GptMessage text= "¿Tu cita habla otro idioma? No te preocupes, traducelo aquí"/>

         {
          messages.map( (message, index) => (
            message.isGPT 
            ? (<GptMessage key={ index } text= {message.text } /> )
            : (<MyMessage  key={ index } text={ message.text }/>)
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

      <TextMessageBoxSelect
      onSendMessage={ handlePost }
      placeHolder="Escribe aquí wapa"
      options={languages}
      />
      
    </div>
  )
}
