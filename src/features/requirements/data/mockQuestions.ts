import type { RequirementAnswer, RequirementQuestion } from "../types.ts";

type FollowUpCondition =
  | { operator: "equals"; value: string }
  | { operator: "one-of"; values: string[] }
  | { operator: "answered" };

interface FollowUpRule {
  condition: FollowUpCondition;
  question: RequirementQuestion;
}

interface RequirementQuestionScenario {
  question: RequirementQuestion;
  followUps?: FollowUpRule[];
}

export const mockRequirementScenarios: RequirementQuestionScenario[] = [
  {
    question: {
      id: "design-style",
      type: "multiple-choice",
      issueType: "missing",
      sourcePage: 1,
      title: "서비스의 디자인 유형을 선택해주세요.",
      description:
        "기획서에 화면의 기능과 동작은 정의되어 있지만, 전체적인 디자인 방향은 정해지지 않았어요.",
      options: [
        {
          label: "트렌디한 디자인",
          value: "trendy",
        },
        {
          label: "추가 개발될 예정입니다!",
          value: "minimal",
        },
      ],
      allowOther: false,
    },
  },
  {
    question: {
      id: "post-author",
      type: "multiple-choice",
      issueType: "missing",
      sourcePage: 2,
      title: "게시글에 작성자 정보를 표시할까요?",
      description:
        "게시글의 제목과 내용은 정의되어 있지만, 작성자 정보를 저장하거나 화면에 표시할지는 정해지지 않았어요.",
      options: [
        { label: "작성자를 표시한다", value: "show-author" },
        { label: "작성자를 표시하지 않는다", value: "hide-author" },
      ],
      allowOther: false,
    },
    followUps: [
      {
        condition: { operator: "equals", value: "show-author" },
        question: {
          id: "followup-author-source",
          type: "multiple-choice",
          issueType: "revision",
          sourcePage: 2,
          title: "작성자 정보는 어디에서 가져올까요?",
          description:
            "작성자를 표시하기로 했기 때문에 실제 게시글에 사용할 작성자 정보의 출처를 정해야 해요.",
          options: [
            { label: "로그인한 사용자 정보", value: "authenticated-user" },
            { label: "게시글 작성 시 직접 입력", value: "manual-input" },
            { label: "고정된 데모 사용자", value: "demo-user" },
          ],
          allowOther: false,
        },
      },
    ],
  },
  {
    question: {
      id: "post-pagination",
      type: "multiple-choice",
      issueType: "missing",
      sourcePage: 2,
      title: "게시글이 많아질 경우 목록을 어떻게 보여줄까요?",
      description:
        "게시글 목록 조회 기능은 정의되어 있지만, 게시글이 많아졌을 때의 목록 처리 방식은 정해지지 않았어요.",
      options: [
        { label: "모든 게시글을 한 번에 표시", value: "all" },
        { label: "페이지네이션 사용", value: "pagination" },
        { label: "무한 스크롤 사용", value: "infinite-scroll" },
      ],
      allowOther: false,
    },
    followUps: [
      {
        condition: { operator: "equals", value: "pagination" },
        question: {
          id: "followup-pagination-size",
          type: "multiple-choice",
          issueType: "revision",
          sourcePage: 2,
          title: "한 페이지에 몇 개의 게시글을 보여줄까요?",
          description:
            "페이지네이션을 사용하기로 했기 때문에 페이지당 노출 개수를 정해야 해요.",
          options: [
            { label: "10개", value: "10" },
            { label: "20개", value: "20" },
            { label: "30개", value: "30" },
          ],
          allowOther: false,
        },
      },
      {
        condition: { operator: "equals", value: "infinite-scroll" },
        question: {
          id: "followup-infinite-scroll-size",
          type: "multiple-choice",
          issueType: "revision",
          sourcePage: 2,
          title: "한 번에 몇 개의 게시글을 추가로 불러올까요?",
          description:
            "무한 스크롤을 사용하기로 했기 때문에 한 번의 요청에서 가져올 게시글 수를 정해야 해요.",
          options: [
            { label: "10개", value: "10" },
            { label: "20개", value: "20" },
            { label: "30개", value: "30" },
          ],
          allowOther: false,
        },
      },
    ],
  },
  {
    question: {
      id: "post-delete-policy",
      type: "multiple-choice",
      issueType: "ambiguous",
      sourcePage: 3,
      title: "게시글 삭제 시 데이터를 어떻게 처리할까요?",
      description:
        "삭제 버튼과 삭제 후 이동 동작은 정의되어 있지만, 실제 데이터를 완전히 삭제할지 삭제 상태로 보관할지 정해지지 않았어요.",
      options: [
        { label: "데이터를 완전히 삭제", value: "hard-delete" },
        { label: "삭제 상태로 변경하여 보관", value: "soft-delete" },
      ],
      allowOther: false,
    },
    followUps: [
      {
        condition: { operator: "equals", value: "soft-delete" },
        question: {
          id: "followup-soft-delete-access",
          type: "multiple-choice",
          issueType: "revision",
          sourcePage: 3,
          title: "삭제된 게시글 URL에 접근하면 어떻게 처리할까요?",
          description:
            "게시글을 삭제 상태로 보관하기로 했기 때문에 기존 상세페이지 URL의 접근 정책을 정해야 해요.",
          options: [
            { label: "404 페이지 표시", value: "not-found" },
            { label: "게시판으로 이동", value: "redirect-board" },
            { label: "삭제된 게시글 안내 표시", value: "deleted-message" },
          ],
          allowOther: false,
        },
      },
    ],
  },
  {
    question: {
      id: "mutation-feedback",
      type: "multiple-choice",
      issueType: "missing",
      sourcePage: 4,
      title: "작성·수정·삭제 결과를 사용자에게 어떻게 알려줄까요?",
      description:
        "CRUD 성공 후 이동할 페이지는 정의되어 있지만, 처리 결과를 사용자에게 전달하는 UI 방식은 정해지지 않았어요.",
      options: [
        { label: "Toast 메시지", value: "toast" },
        { label: "Alert 메시지", value: "alert" },
        { label: "별도 메시지 없이 페이지 이동", value: "none" },
      ],
      allowOther: false,
    },
    followUps: [
      {
        condition: { operator: "one-of", values: ["toast", "alert"] },
        question: {
          id: "followup-feedback-message",
          type: "text",
          issueType: "revision",
          sourcePage: 4,
          title: "작성·수정·삭제 완료 시 표시할 메시지를 정해주세요.",
          description:
            "사용자에게 결과 메시지를 보여주기로 했기 때문에 각 CRUD 동작의 구체적인 안내 문구가 필요해요.",
          placeholder:
            "예) 게시글이 작성되었습니다. / 수정되었습니다. / 삭제되었습니다.",
          maxLength: 300,
        },
      },
    ],
  },
  {
    question: {
      id: "post-length-limit",
      type: "text",
      issueType: "missing",
      sourcePage: 2,
      title: "게시글 제목과 내용의 최대 글자 수를 정해주세요.",
      description:
        "제목과 내용은 필수 입력값으로 정의되어 있지만 각각 입력할 수 있는 최대 글자 수가 정해지지 않았어요.",
      placeholder: "예) 제목 최대 100자, 내용 최대 10,000자",
      maxLength: 200,
    },
    followUps: [
      {
        condition: { operator: "answered" },
        question: {
          id: "followup-length-validation",
          type: "multiple-choice",
          issueType: "ambiguous",
          sourcePage: 2,
          title: "글자 수 제한을 초과하면 어떻게 처리할까요?",
          description:
            "최대 글자 수를 정했기 때문에 제한을 초과한 입력에 대한 UI 동작도 정해야 해요.",
          options: [
            { label: "최대 글자 수 이상 입력 불가", value: "block-input" },
            {
              label: "입력은 허용하고 에러 메시지 표시",
              value: "validation-error",
            },
          ],
          allowOther: false,
        },
      },
    ],
  },
];

export const mockRequirementQuestions = mockRequirementScenarios.map(
  ({ question }) => question,
);

function matchesCondition(
  condition: FollowUpCondition,
  answer: RequirementAnswer | undefined,
) {
  if (!answer) return false;

  if (condition.operator === "answered") {
    return answer.value.trim().length > 0;
  }

  if (condition.operator === "equals") {
    return answer.value === condition.value;
  }

  return condition.values.includes(answer.value);
}

export function resolveMockFollowUpQuestions(
  answers: Record<string, RequirementAnswer>,
): RequirementQuestion[] {
  return mockRequirementScenarios.flatMap(({ question, followUps = [] }) =>
    followUps
      .filter(({ condition }) =>
        matchesCondition(condition, answers[question.id]),
      )
      .map(({ question: followUpQuestion }) => followUpQuestion),
  );
}
