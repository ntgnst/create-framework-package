module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'should-contain-task-id': [2, 'always'],
    'header-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72],
    'footer-max-line-length': [2, 'always', 72],
  },
  plugins: [
    {
      rules: {
        'should-contain-task-id': (obj) => {
          const { footer } = obj;

          if (footer) {
            const loweredFooter = footer.toLowerCase();

            const isValid = !!loweredFooter.match(/(relates|resolves): [#](\d)*/gm).length;

            return [
              isValid,
              `Your commit message must contain related task with the following pattern:
              Relates: #132213
              or
              Resolves: #12313
              or both with comma separated in case commit is related to multiple works
              Relates: #313221, Resolves: 123123`,
            ];
          }

          return [false, 'You must provide task id.'];
        },
      },
    },
  ],
};
