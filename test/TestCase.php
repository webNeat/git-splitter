<?php
namespace Wn\GitSplitter\Tests;

abstract class TestCase extends \PHPUnit\Framework\TestCase {

    /**
     * Checks all assertions.
     *
     * @param  array $assertions [[expected1, value1], [expected2, value2], ...]
     * @return void
     */
    protected function assertAll($assertions) {
        foreach ($assertions as $assertion) {
            $this->assertEquals($assertion[1], $assertion[0]);
        }
    }
}
