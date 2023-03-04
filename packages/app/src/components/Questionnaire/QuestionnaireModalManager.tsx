import { StatusType } from '~/interfaces/questionnaire/questionnaire-answer-status';
import { IQuestionnaireOrderHasId } from '~/interfaces/questionnaire/questionnaire-order';
import { useCurrentUser } from '~/stores/context';
import { useSWRxQuestionnaireOrders } from '~/stores/questionnaire';

import QuestionnaireModal from './QuestionnaireModal';
import QuestionnaireToast from './QuestionnaireToast';

import styles from './QuestionnaireModalManager.module.scss';

const QuestionnaireModalManager = ():JSX.Element => {
  const { data: questionnaireOrders } = useSWRxQuestionnaireOrders();
  const { data: currentUser } = useCurrentUser();

  const questionnaireOrdersToShow = (questionnaireOrders: IQuestionnaireOrderHasId[] | undefined) => {
    if (currentUser) {
      return questionnaireOrders;
    }
    return questionnaireOrders?.filter((questionnaireOrder) => {
      const localAnswerStatus = localStorage.getItem(questionnaireOrder._id);
      return !localAnswerStatus || localAnswerStatus === StatusType.not_answered;
    });
  };

  return <>
    {questionnaireOrders?.map((questionnaireOrder) => {
      return <QuestionnaireModal
        questionnaireOrder={questionnaireOrder}
        key={questionnaireOrder._id} />;
    })}
    <div className={styles['grw-questionnaire-toasts']}>
      {questionnaireOrdersToShow(questionnaireOrders)?.map((questionnaireOrder) => {
        return <QuestionnaireToast questionnaireOrder={questionnaireOrder} key={questionnaireOrder._id}/>;
      })}
    </div>
  </>;
};

export default QuestionnaireModalManager;
