export const TEAM_NAME_MIN_LENGTH = 2
export const TEAM_NAME_MAX_LENGTH = 20

const TEAM_NAME_PATTERN = /^[가-힣a-zA-Z0-9][가-힣a-zA-Z0-9 _-]*$/

export function getTeamNameError(teamName: string) {
  const normalizedTeamName = teamName.trim()

  if (!normalizedTeamName) {
    return '팀 이름을 입력해주세요.'
  }

  if (
    normalizedTeamName.length < TEAM_NAME_MIN_LENGTH ||
    normalizedTeamName.length > TEAM_NAME_MAX_LENGTH
  ) {
    return `팀 이름은 ${TEAM_NAME_MIN_LENGTH}~${TEAM_NAME_MAX_LENGTH}자로 입력해주세요.`
  }

  if (!TEAM_NAME_PATTERN.test(normalizedTeamName)) {
    return '한글, 영문, 숫자, 공백, 하이픈과 밑줄만 사용할 수 있어요.'
  }

  return null
}
