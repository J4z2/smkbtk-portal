<?php

namespace Tests\Unit;

use App\Services\Coex;
use App\Support\Identity;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class CoexTest extends TestCase
{
    public function test_default_rules_are_valid_and_g_grades_display_as_g(): void
    {
        Coex::validateRules(Coex::defaultRules());
        $this->assertSame('G', Coex::displayGrade('G1'));
        $this->assertSame('A-', Coex::displayGrade('A-'));
    }

    public function test_gaps_and_overlaps_are_rejected(): void
    {
        $rules = Coex::defaultRules();
        $rules[3]['min_mark'] = 44;
        $this->expectException(InvalidArgumentException::class);
        Coex::validateRules($rules);
    }

    public function test_suggested_target_and_average(): void
    {
        $this->assertSame(50, Coex::suggestedTarget(30));
        $this->assertSame(96, Coex::suggestedTarget(96));
        $this->assertSame(60, Coex::average([50, 70, null]));
        $this->assertNull(Coex::average([null]));
    }

    public function test_phone_normalisation(): void
    {
        $this->assertSame('60123456789', Identity::normalizePhone('012-345 6789'));
        $this->assertSame('60123456789', Identity::normalizePhone('+60 12 345 6789'));
        $this->assertSame('800101011234', Identity::normalizeIc('800101-01-1234'));
    }
}
