import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import ErrorBoundary from "../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../shared/components/loading/Loading";
import { useAppContext } from "../shared/functions/Context";
// import { FormEvent, useState } from "react";

export const title = "Electronic Performance Management System";

export const paragraph = [
  `Performance Management is an ongoing engagement and communication process involving the supervisor and the subordinate (employees).`,
  `The ECB Performance Evaluation is conducted bi-annually (twice per year) in two semesters.`,
];
export const list = [
  `Semester 1 (S1): April - September (Mid-Term Review)`,
  `Semester 2 (S2): October - March (Final Review)`,
];

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const Loader = () => {
  return (
    <div style={style}>
      <LoadingEllipsis />
    </div>
  );
};

type ILocationState = {
  from: string;
};

const LoggedOut = observer(() => {
  const { api, store } = useAppContext();
  const location = useLocation();

  // const [loading, setLoading] = useState(false);
  // const [signInForm, setSignInForm] = useState({
  //   email: "",
  //   password: "",
  // });
  // const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const { email, password = "" } = signInForm;
  //   const $user = await api.auth.signIn(email, password);

  //   if (!$user) {
  //     setLoading(false);
  //     return;
  //   }
  // };

  const redirectSignIn = () => {
    api.auth.logInWithPopup();
  };

  if (store.auth.loading) return <Loader />;

  if (!store.auth.loading && store.auth.me) {
    const state = location.state as ILocationState;

    if (state) return <Navigate to={state.from} />;
    return <Navigate to="/c/home/dashboard" />;
  }

  return (
    <ErrorBoundary>
      <div
        className="uk-section logged-out"
        style={{
          backgroundImage: `url(/images/ecb-bg.png)`,
        }}
      >
        <div className="uk-container">
          <div className="uk-width-1-2@m card1">
            <h3 className="uk-card-title">{title}</h3>
            {paragraph.map((pr, index) => (<p key={index}> {pr}</p>))}
            <div>
              <ul className="uk-list uk-list-disc">
                {list.map((l, index) => (
                  <li key={index}>{l}</li>
                ))}
              </ul>
            </div>
            <button className="uk-button uk-margin loggin-button" onClick={redirectSignIn} >
              Login
            </button>
            {/* <form className="uk-form-stacked" onSubmit={onSignIn}>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="user-login-email">
                  Email
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    id="user-login-email"
                    type="email"
                    placeholder="Email"
                    value={signInForm.email}
                    onChange={(e) =>
                      setSignInForm({ ...signInForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="user-login-password">
                  Password
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    id="user-login-password"
                    type="password"
                    placeholder="Password"
                    value={signInForm.password}
                    onChange={(e) =>
                      setSignInForm({
                        ...signInForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-margin">
                <button
                  className="uk-button uk-button-secondary uk-margin-right"
                  type="submit"
                >
                  Login
                  {loading && (
                    <div
                      className="uk-margin-small-left"
                      data-uk-spinner="ratio: 0.5"
                    ></div>
                  )}
                </button>
              </div>
            </form> */}
          </div>
          <div
            className=" uk-child-width-1-3@s uk-grid-match uk-text-center"
            data-uk-grid
          >
            <div>
              <div className="uk-card uk-card-small uk-card-default cards">
                <div className="uk-margin-top uk-flex-middle">
                  <div className="uk-width-auto">
                    <img width="60" height="60" src="images/meter.svg" alt="" />
                  </div>
                </div>
                <div className="uk-card-body">
                  <div className="uk-width-expand">
                    <h3 className="uk-card-title uk-margin-remove-bottom">
                      Performance <br /> Management
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-small uk-card-default cards">
                <div className="uk-margin-top uk-flex-middle">
                  <div className="uk-width-auto">
                    <img width="100" height="100" src="images/stars.svg" alt="" />
                  </div>
                </div>
                <div className="uk-card-body">
                  <div className="uk-width-expand">
                    <h3 className="uk-card-title uk-margin-remove-bottom">
                      Performance
                      <br /> Contract
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-small uk-card-default cards">
                <div className="uk-margin-top uk-flex-middle">
                  <div className="uk-width-auto">
                    <img width="60" height="60" src="images/hand.svg" alt="" />
                  </div>
                </div>
                <div className="uk-card-body">
                  <div className="uk-width-expand">
                    <h3 className="uk-card-title uk-margin-remove-bottom">
                      Performance <br />
                      Appraisal
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-container technical">
          <div className="uk-width-1-1 uk-card card2">
            <h3 className="uk-card-title">For Technical Support</h3>
            <div className="uk-flex">
              <p>
                Contact :<a href="tel:(+264) 83 330 1830">(+264) 83 330 1830</a>
              </p>
              <p className="uk-margin-small-left">
                Email :
                <a href="mailto:engdesign@lotinsights.com">
                  engdesign@lotsinsights.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default LoggedOut;
