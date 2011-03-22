TEST = expresso

test:
	@$(TEST) -I lib/

test-cov:
	@$(TEST) -I lib/ --cov
.PHONY: test