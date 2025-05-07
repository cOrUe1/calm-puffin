import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { showError } from '@/utils/toast';
import '@/pages/LandingPage.css';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface IFormInput {
  nome: string;
  cognome: string;
  citta: string;
  email: string;
  telefono: string;
  privacy: boolean;
}

// Definiamo i limiti temporali in UTC
// Chiusura Venerdì 9 Maggio 2025 ore 20:00 CEST (UTC+2) -> 18:00 UTC
const REGISTRATION_CLOSE_1_UTC = new Date(Date.UTC(2025, 4, 9, 18, 0, 0)); // Mese 4 è Maggio
// Riapertura Sabato 10 Maggio 2025 ore 17:00 CEST (UTC+2) -> 15:00 UTC
const REGISTRATION_REOPEN_UTC = new Date(Date.UTC(2025, 4, 10, 15, 0, 0));
// Chiusura definitiva Sabato 10 Maggio 2025 ore 20:00 CEST (UTC+2) -> 18:00 UTC
const REGISTRATION_CLOSE_2_UTC = new Date(Date.UTC(2025, 4, 10, 18, 0, 0));

const LandingPageForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<IFormInput>();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const scriptURL = 'https://script.google.com/macros/s/AKfycbz2W-a-YPD5hN7A3OJMdFtZ6buHWpCyXxBkXobVFaJAcd--y96wRZL9Eu4bVijjBaedFg/exec';

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const now = new Date();
    let canSubmit = false;
    let errorMessage = "Le registrazioni sono momentaneamente chiuse."; // Messaggio di default

    // Verifica se l'ora corrente è prima della prima chiusura
    if (now <= REGISTRATION_CLOSE_1_UTC) {
      canSubmit = true;
    } 
    // Verifica se l'ora corrente è nella finestra di riapertura
    else if (now >= REGISTRATION_REOPEN_UTC && now <= REGISTRATION_CLOSE_2_UTC) {
      canSubmit = true;
    }

    if (!canSubmit) {
      // Determina il messaggio di errore specifico
      if (now > REGISTRATION_CLOSE_1_UTC && now < REGISTRATION_REOPEN_UTC) {
        errorMessage = "Le registrazioni sono temporaneamente chiuse. Riapriranno Sabato 10 Maggio 2025 dalle 17:00 alle 20:00 (ora italiana).";
      } else if (now > REGISTRATION_CLOSE_2_UTC) {
        errorMessage = "Le registrazioni per questo evento sono definitivamente terminate.";
      }
      showError(errorMessage);
      return; // Interrompe l'invio
    }

    // Se canSubmit è true, procedi con l'invio
    const formData = new FormData();
    (Object.keys(data) as Array<keyof IFormInput>).forEach((key) => {
       if (key === 'privacy') {
         if (data[key]) {
            formData.append(key, 'on');
         }
       } else {
         formData.append(key, data[key]);
       }
    });
    formData.append('timestamp', new Date().toISOString());

    console.log("Invio dati a Google Sheets:", Object.fromEntries(formData.entries()));

    try {
      await fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      console.log('Richiesta inviata (no-cors). Assumendo successo.');
      setIsSubmitSuccessful(true);
      reset();

    } catch (error) {
      console.error('Errore durante invio a Google Sheets:', error);
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
        
        {!isSubmitSuccessful ? (
          <>
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
                    value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
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
                <div>
                  <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">
                    Acconsento al trattamento dei miei dati personali
                  </Link> per finalità informative e di marketing.
                  <span>(Tranquillo, niente spam: siamo gente d’arredamento, non di fastidio!)</span>
                </div>
              </label>
              {errors.privacy && <small style={{ marginTop: '-15px', marginBottom: '15px' }}>{errors.privacy.message}&nbsp;</small>}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Invio in corso...' : 'Invia'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 px-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Registrazione Completata!</h2>
            <p className="text-lg md:text-xl text-gray-200 mb-6">
              <strong>Grazie mille per la tua partecipazione!</strong><br /> La tua richiesta è stata registrata con successo.
            </p>
            <p className="text-gray-300">
              Conserva questa pagina o fai uno screenshot come promemoria per il tuo <strong>sconto del 10%</strong>, valido fino al 31 dicembre 2025.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              (Se desideri registrare un'altra persona, puoi ricaricare la pagina)
            </p>
          </div>
        )}

        <div className="footer">
          Il nostro evento è solo l'inizio. Se ti va, lasciaci i tuoi contatti: <em>molte sorprese devono ancora arrivare...</em>
        </div>
      </div>
    </div>
  );
};

export default LandingPageForm;