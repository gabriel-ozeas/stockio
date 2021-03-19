import React, { useEffect } from 'react';
import Stocks from '../Stocks';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import useSound from 'use-sound';

const beginningPhrases = [
    "É bom acompanhar essa",
    "Olha só que está com o dinheiro",
    "Alguem está comprando tudo",
    "Agora é hora",
    "Acho que alguém comprou tudo"
];

const endingPhases = [
    'Parece que alguém está de olho no setor de ',
    'Com isso ele aumenta sua posição no setor de ',
    'Parece que ele viu algo interessante no setor de '
];

const BuyCard = ({ operation }) => {
    const stock = Stocks.find(s => operation.code.startsWith(s.code));

    if (!stock) {
        return null;
    }

    const [playOn] = useSound(
        '/sounds/rising-pops.mp3',
        { volume: 1 }
    );

    const name = "Gabriel";
    const begin = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
    const ending = endingPhases[Math.floor(Math.random() * endingPhases.length)];

    let stats = null;

    if (operation.perc) {
        stats = (<span>A posicão dele aumentou em <span className="font-bold">{operation.perc.toFixed(2)}%</span>.</span>);
    }

    const when = formatDistance(operation.date, new Date(), { locale: ptBR, addSuffix: true  });

    return (
        <div className="max-w-2xl rounded overflow-hidden shadow-md my-4 bg-white newMessageItem">
            <div className="px-6 py-4">
                <div className="flex flex-row">
                    <img src={stock.img} width={70} height={70} className="mr-5"/>
                    <p className="text-gray-700 text-base">
                        {begin}. <span className="font-bold">{name}</span> {''}
                        comprou ações da empresa <span className="font-bold">{stock.name}.</span> {stats} {''}
                        {ending} {stock.sector.toLocaleLowerCase()}.
                    </p>
                </div>
                
                <div className="flex justify-between mt-2 items-center">
                    <div className="items-center flex flex-row">
                        <small>{when}</small>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 text-gray-500 ml-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 text-gray-500 ml-2">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 text-gray-500 ml-2">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex justify-end items-center">
                            {operation.perc ? null : (<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-yellow-500 bg-yellow-100 rounded-full mr-2">Ação Nova</span>)}
                            
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-500 bg-indigo-100 rounded-full mr-2">{operation.code}</span>
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-500 bg-green-100 rounded-full">Compra</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>);
};

export default BuyCard;