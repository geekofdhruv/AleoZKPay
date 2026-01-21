// The 'test_zk_pay' test program.
import zk_pay.aleo;
program test_zk_pay.aleo {
    @test
    script test_it() {
        let result: u32 = zk_pay.aleo/main(1u32, 2u32);
        assert_eq(result, 3u32);
    }

    @test
    @should_fail
    transition do_nothing() {
        let result: u32 = zk_pay.aleo/main(2u32, 3u32);
        assert_eq(result, 3u32);
    }

    @noupgrade
    async constructor() {}
}
