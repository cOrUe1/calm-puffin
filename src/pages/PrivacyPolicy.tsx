import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Informativa sul Trattamento dei Dati Personali</h1>
      <div className="prose prose-invert max-w-none text-gray-300"> {/* Use prose for styling and invert for dark background */}
        <p>
          Ai sensi dell’art. 13 del Regolamento (UE) 2016/679 (di seguito “GDPR”), MOBILI CORAZZI, in qualità di titolare del trattamento (di seguito anche “Titolare”), informa gli interessati che i dati personali raccolti attraverso il modulo presente su questa pagina verranno trattati nel rispetto dei principi di liceità, correttezza, trasparenza e tutela della riservatezza e dei diritti dell’interessato.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Finalità del trattamento</h2>
        <p>
          I dati saranno trattati per finalità di natura promozionale, informativa e commerciale relative all’evento in corso e alle attività future del Titolare, comprese comunicazioni su prodotti, iniziative, offerte speciali o inviti ad eventi esclusivi, mediante strumenti sia automatizzati (email, messaggistica, ecc.) sia tradizionali (telefonate con operatore, posta cartacea).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Base giuridica</h2>
        <p>
          Il trattamento è lecito in quanto basato sul consenso esplicito dell’interessato, manifestato attraverso la selezione della relativa casella di autorizzazione.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Modalità di trattamento</h2>
        <p>
          I dati saranno trattati da personale autorizzato, con strumenti manuali e/o informatici, nel rispetto delle misure di sicurezza previste dalla normativa vigente, in modo da garantirne la riservatezza, l'integrità e la disponibilità.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Conservazione dei dati</h2>
        <p>
          I dati saranno conservati per un periodo non superiore a 24 mesi, salvo eventuale revoca del consenso da parte dell’interessato.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Comunicazione e diffusione</h2>
        <p>
          I dati non saranno oggetto di diffusione. Potranno essere comunicati a soggetti terzi solo ove necessario per l’erogazione del servizio richiesto (es. piattaforme di gestione email, servizi informatici, cloud provider), in ogni caso garantendo adeguati livelli di protezione.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Diritti dell’interessato</h2>
        <p>
          L’interessato potrà, in qualsiasi momento, esercitare i diritti previsti dagli articoli da 15 a 22 del GDPR, tra cui: accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei dati. L’interessato ha inoltre il diritto di revocare il consenso prestato, senza pregiudicare la liceità del trattamento effettuato prima della revoca. Tali richieste potranno essere esercitate scrivendo all’indirizzo email <a href="mailto:info@mobilicorazzi.com" className="text-blue-400 hover:underline">info@mobilicorazzi.com</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Titolare del trattamento</h2>
        <p>
          Il Titolare del trattamento è Mobili Corazzi – Via S. Martino, 52, 53025 Piancastagnaio SI – Email: <a href="mailto:info@mobilicorazzi.com" className="text-blue-400 hover:underline">info@mobilicorazzi.com</a>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Modifiche alla presente informativa</h2>
        <p>
          Il Titolare si riserva il diritto di modificare la presente informativa in qualunque momento. Le versioni aggiornate saranno rese disponibili sul sito ufficiale.
        </p>
      </div>
       <div className="mt-8 text-center">
         <a href="/" className="text-blue-400 hover:underline">Torna alla pagina principale</a>
       </div>
    </div>
  );
};

export default PrivacyPolicy;