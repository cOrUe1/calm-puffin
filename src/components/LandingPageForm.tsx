import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { showError } from '@/utils/toast'; // showSuccess non è più usato qui
import '@/pages/LandingPage.css'; // Importa il CSS specifico
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import { CheckCircle } from 'lucide-react'; // Icona per il messaggio di successo

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

  const scriptURL = 'https://script.google.com/macros/s/AKfycbz2W-a-YPD5hN7A3OJMdFtZ6buHWpCyXxBkXobVFaJAcd--y96wRZL9Eu4bVijjBaedFg/exec';

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Non resettare isSubmitSuccessful qui, lo facciamo solo se l'utente vuole inviare di nuovo (non implementato)
    // o al caricamento iniziale della pagina.
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
      setIsSubmitSuccessful(true); // Mostra il messaggio di successo
      reset(); // Resetta i campi del form

    } catch (error) {
      console.error('Errore durante invio a Google Sheets:', error);
      if (error instanceof Error) {
         showError(`Si è verificato un errore: ${error.message}. Riprova.`);
      } else {
         showError("Si è verificato un errore sconosciuto. Riprova.");
      }
       setIsSubmitSuccessful(false); // Mantieni il form visibile in caso di errore
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