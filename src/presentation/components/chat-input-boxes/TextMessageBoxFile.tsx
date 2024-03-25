import { FormEvent, useRef, useState } from "react";

interface Props {
    onSendMessage: (message:string, file: File) => void;
    placeHolder?:string;
    disableCorrections?:boolean;
    accept?: string;
}
export const TextMessageBoxFile = ({onSendMessage, placeHolder, disableCorrections = false, accept}:Props) => {
    
    const [message, setMessage] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null | undefined>();

    const inputFileRef = useRef<HTMLInputElement>(null);
    
    const handleSendMessage = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       //  if (message.trim().length === 0) return;

       if(!selectedFile) return;

        onSendMessage(message, selectedFile);

        setMessage('');

        setSelectedFile(null);
    }
  
  
    return (
    <form onSubmit={handleSendMessage}
    className="h-16 w-full bg-white rounded-xl px-4 flex flex-row items-center">

        <div className="mr-3">
            <button type="button"
            className="flex items justify-center text-gray-400 hover:text-gray-600"
            onClick={ () => inputFileRef.current?.click()}>
                <i className="fa-solid fa-paperclip text-xl"></i>
            </button>

            <input type="file"
                   ref= {inputFileRef} 
                   accept={ accept }
                   onChange={e => setSelectedFile(e.target.files?.item(0))}
                   hidden/>
        </div>

        <div className="flex-grow">
            <div className="relative w-full">
                <input 
                type="text" 
                autoFocus
                name="message"
                className="flex w-full rounded-xl text-gray-800 focus:outline-none border focus:border-indigo-300 p-4 h-10"
                placeholder={ placeHolder }
                autoComplete={disableCorrections ? 'on' : 'off'}
                autoCorrect={disableCorrections ? 'on' : 'off'}
                spellCheck={disableCorrections ? 'true' : 'false'}
                value={message}
                onChange={e => setMessage(e.target.value)}/>
            </div>
        </div>

        <div className="ml-4">
            <button className="btn-primary">
                {
                    (!selectedFile)
                        ? <span className="mr-2">Enviar</span>
                        : <span className="mr-2">
                            {selectedFile.name.substring(0,10) + '...'}
                        </span>
                }
                <span className="mr-2">Enviar</span>
                <i className="fa-regular fa-paper-plane"></i>
            </button>
        </div>

    </form>
  )
}
