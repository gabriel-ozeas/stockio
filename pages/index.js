import Head from 'next/head';
import CeiCrawler from 'cei-crawler';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import format from 'date-fns/format';
import Stocks from '../lib/Stocks';

import { getSession, signIn, useSession } from "next-auth/client";

import BuyCard from '../lib/components/BuyCard';
import { useEffect, useState } from 'react';

const WalletView = ({wallet}) => {
  const list = Object.entries(wallet);
  const walletTotal = list.reduce((acc, stock) => acc + stock[1].total, 0);

  return (
    <div className="grid grid-cols-4">
      {Object.entries(wallet).map((w, index) => {
        const code = w[0];
        const stock = Stocks.find(s => code.startsWith(s.code));

        const { quantity, total } = w[1];

        return (
          <div className="flex flex-col justify-center items-center newMessageItem rounded overflow-hidden shadow-md bg-white p-5 m-3 border-2 border-gray-100 " key={index.toString()}>
            <img src={stock.img} width={100} height={100} className="pb-3" />
            <div className="font-sans text-xl font-bold">{code}</div>
            <div>{(total / walletTotal * 100).toFixed(2)} %</div>
          </div>
        );
      })}
    </div>
  );
}

const TimelineView = ({history}) => {
  return (
    <>
    {history.map((h, index) => {
      if (h.operation === 'C') {
        const stock = Stocks.find(s => h.code.startsWith(s.code));
        if (!stock) {
          return null;
        }

        return <BuyCard operation={h} key={index.toString()} />
      }
      return null;
    })}
    </>
  );
};

export default function Home({ history, user }) {
  console.log(user);

  history = history
    .map(h => ({...h, date: parseISO(h.date)}))
    .sort((a,b) => { return a.date - b.date});

  const [wallet, setWallet] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);  
  const [currentHistory, setCurrentHistory] = useState([]);

  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    const operation = {...history[currentIndex]};
    if (operation.operation === 'V') {
      return;
    }

    const stock = Stocks.find(s => operation.code.startsWith(s.code));
    
    if (stock) {
      if (!wallet[stock.code]) {

        const newWallet = {...wallet};
        newWallet[stock.code] = {};
        newWallet[stock.code]['quantity'] = operation.quantity;
        newWallet[stock.code]['total'] = operation.totalValue;
        
        setWallet(newWallet);
      } else {
        const newWallet = {...wallet};
        const oldStock  = {...wallet[stock.code]};

        newWallet[stock.code].quantity = oldStock.quantity + operation.quantity;
        newWallet[stock.code].total = oldStock.total + operation.totalValue;

        setWallet(newWallet);

        const perc = operation.totalValue / newWallet[stock.code].total * 100;
        operation['perc'] = perc;
        console.log(stock, oldStock, operation, newWallet);
      }
    }

    setCurrentHistory(previous => [...previous, operation]);
  }, [currentIndex])
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(previous => previous + 1);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [history]);

  return (
    <div className="h-full w-full py-2 bg-gray-100">
      <Head>
        <title>Stocks.io</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-1 gap-x-10 justify-center mt-10">
        <div className="mx-auto max-w-2xl ">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center mb-3">
              <div className="rounded-full mr-3"><img src={user.image} className="rounded-full"/></div>
              <div>
                <h3 className="font-bold font-sans">{user.name}</h3>
                <span className="text-indigo-600 font-sans text-lg font-bold py-1 cursor-pointer" onClick={() => setShowWallet(p => !p)}>
                  {showWallet ? 'Ver Timeline' : 'Ver Carteira'}
                </span>
              </div>
              
            </div>

            <div className="flex flex-row">
              <div className="flex flex-col justify-center items-center mx-2">
                <h3 className="font-sans text-xl font-bold">0</h3>
                <h5>Publicacões</h5>
              </div>
              <div className="flex flex-col justify-center items-center mx-2">
                <h4 className="font-sans text-xl font-bold">0</h4>
                <h5>Seguidores</h5>
              </div>
              <div className="flex flex-col justify-center items-center mx-2">
                <h4 className="font-sans text-xl font-bold">0</h4>
                <h5>Seguindo</h5>
              </div>
            </div>
         </div>

        
        <div className="flex flex-col-reverse justify-between items-center mx-auto">
            {showWallet ? (<WalletView wallet={wallet} />) : (<TimelineView history={currentHistory} />)}
        </div>
        </div>
        
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    const { res } = ctx;
    const baseUrl = process.env.BASE_URL;
    const callbackUrl = `${baseUrl}/`;

    res.statusCode = 302;
    res.setHeader("Location", `${baseUrl}/api/auth/signin?callbackUrl=${callbackUrl}`);
    res.end();

    return { props: {} };
  }

  let ceiCrawler = new CeiCrawler('usuario', 'senha', {/* options */});
  ceiCrawler.login();

  let wallets = await ceiCrawler.getStockHistory();
  let history = wallets
      .filter(a => a.account === 'numero da conta')
      .flatMap(a => a.stockHistory)
      .map(history => { return {...history, date: formatISO(history.date) }});  
    
  return { props: { history: history, user: session.user } }
}
