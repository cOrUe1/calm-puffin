import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { showSuccess, showError } from '@/utils/toast'; // Usa le funzioni toast esistenti
import '@/pages/LandingPage.css'; // Importa il CSS specifico
import { Link } from 'react-router-dom'; // Import Link for internal navigation

interface IFormInput {
  nome: string;
  cognome: string;
  citta: string;
  email: string;
  telefono: string;
  privacy: boolean;
}

const LandingPageForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<IFormInput>();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  // Updated Google Apps Script URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbz2W-a-YPD5hN7A3OJMdFtZ6buHWpCyXxBkXobVFaJAcd--y96wRZL9Eu4bVijjBaedFg/exec';

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitSuccessful(false); // Reset success state on new submission
    const formData = new FormData();
    // Aggiungi i campi al FormData come richiesto dallo script Google
    (Object.keys(data) as Array<keyof IFormInput>).forEach((key) => {
       // Converti il booleano della privacy in stringa 'on' se true, altrimenti non aggiungerlo o aggiungi ''
       if (key === 'privacy') {
         if (data[key]) {
            formData.append(key, 'on'); // Google Apps Script spesso si aspetta 'on' per le checkbox
         }
       } else {
         formData.append(key, data[key]);
       }
    });

    // Aggiungi un timestamp per evitare duplicati (opzionale, ma utile)
    formData.append('timestamp', new Date().toISOString());

    console.log("Invio dati a Google Sheets:", Object.fromEntries(formData.entries()));


    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // Necessario per richieste cross-origin a Google Scripts senza risposta diretta
      });

      // NOTA: con mode: 'no-cors', non possiamo leggere la risposta.
      // Assumiamo successo se la richiesta non lancia un errore di rete.
      console.log('Richiesta inviata (no-cors). Assumendo successo.');
      showSuccess("Grazie! La tua partecipazione è stata registrata con successo"); // Updated message
      setIsSubmitSuccessful(true);
      reset(); // Resetta il form dopo l'invio

    } catch (error) {
      console.error('Errore durante invio a Google Sheets:', error);
      // Controlla se l'errore è di rete o altro
      if (error instanceof Error) {
         showError(`Si è verificato un errore: ${error.message}. Riprova.`);
      } else {
         showError("Si è verificato un errore sconosciuto. Riprova.");
      }
       setIsSubmitSuccessful(false);
    }
  };

  return (
    <div className="landing-body">
      <div className="landing-container">
        <div className="logo-wrapper">
          <a href="https://www.mobilicorazzi.com/" target="_blank" rel="noopener noreferrer">
            <img src="https://i.postimg.cc/Y0s2wtmk/Corazzi-white-upscaled.png" alt="Logo Mobili Corazzi" className="logo" />
          </a>
          <a href="https://www.stosacucine.com/it/" target="_blank" rel="noopener noreferrer">
            <img src="https://i.postimg.cc/PJQ5DCbw/logo-stosa.png" alt="Logo Stosa Cucine" className="logo" />
          </a>
        </div>
        <h1>Sta per accadere qualcosa di <em>speciale</em>...</h1>
        <p>
          <span className="typing-wrapper">
            <span className="typing-text">Materiali pregiati, atmosfere suggestive, design che emoziona.</span>
          </span>
        </p>
        <p>
          Per celebrare il nostro <strong>nuovo inizio con Stosa</strong>:<br />
          ai <em>primi 10 ordini</em> di una cucina da almeno 4.900€ (inclusi top e 4 elettrodomestici Samsung), <strong>regaliamo un elettrodomestico Samsung</strong> a scelta tra <em>smart TV 55", lavatrice o asciugatrice</em>.
        </p>
        <p>
          E per te che sei stato con noi oggi, il nostro <em>grazie più sincero</em>:<br />
          compila il form e ricevi uno <strong>sconto del 10%</strong> su tutti gli acquisti, valido fino al <em>31 dicembre 2025</em>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="landing-form" noValidate>
          <input
            type="text"
            placeholder="Nome"
            {...register("nome", { required: "Inserisci il nome." })}
          />
          <small>{errors.nome?.message}&nbsp;</small>

          <input
            type="text"
            placeholder="Cognome"
            {...register("cognome", { required: "Inserisci il cognome." })}
          />
          <small>{errors.cognome?.message}&nbsp;</small>

          <input
            type="text"
            placeholder="Città"
            {...register("citta", { required: "Inserisci la città." })}
          />
          <small>{errors.citta?.message}&nbsp;</small>

          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Inserisci una email valida.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Formato email non valido."
              }
            })}
          />
          <small>{errors.email?.message}&nbsp;</small>

          <input
            type="tel"
            placeholder="Numero di Telefono"
            {...register("telefono", {
              required: "Inserisci un numero di telefono.",
              pattern: {
                 value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, // Pattern generico per telefono
                 message: "Formato numero non valido."
              }
             })}
          />
          <small>{errors.telefono?.message}&nbsp;</small>

          <label>
            <input
              type="checkbox"
              {...register("privacy", { required: "Devi accettare l'informativa sulla privacy." })}
            />
            <div> {/* Contenitore per il testo della label */}
              <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">
                Acconsento al trattamento dei miei dati personali
              </Link> per finalità informative e di marketing.
              <span>(Tranquillo, niente spam: siamo gente d’arredamento, non di fastidio!)</span>
            </div>
          </label>
          {/* Mostra errore privacy separatamente se necessario */}
           {errors.privacy && <small style={{ marginTop: '-15px', marginBottom: '15px' }}>{errors.privacy.message}&nbsp;</small>}


          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Invio in corso...' : 'Invia'}
          </button>
        </form>

        <div className="footer">
          Il nostro evento è solo l'inizio. Se ti va, lasciaci i tuoi contatti: <em>molte sorprese devono ancora arrivare...</em>
        </div>
      </div>
    </div>
  );
};

export default LandingPageForm;