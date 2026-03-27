#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MissionDef.generated.h"

UENUM(BlueprintType)
enum class EMissionType : uint8
{
	Main,
	Side
};

USTRUCT(BlueprintType)
struct FMissionStage
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	FName StageId;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	FText ObjectiveText;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	FName TargetLocationTag;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	float TimeLimitSeconds = 0.f; // 0 = no limit
};

UCLASS(BlueprintType)
class HAMPIRUNNER_API UMissionDef : public UDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	FName MissionId;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	EMissionType Type = EMissionType::Main;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	FText Title;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, meta=(MultiLine="true"))
	FText Description;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	TArray<TObjectPtr<UMissionDef>> Prerequisites;

	UPROPERTY(EditAnywhere, BlueprintReadOnly)
	TArray<FMissionStage> Stages;
};
